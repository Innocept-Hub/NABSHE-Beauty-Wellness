import zlib
import struct
import binascii

def decode_png(filename):
    with open(filename, 'rb') as f:
        data = f.read()
    pos = 8
    idat = bytearray()
    w, h = 0, 0
    while pos < len(data):
        length, = struct.unpack('>I', data[pos:pos+4])
        chunk_type = data[pos+4:pos+8]
        if chunk_type == b'IHDR':
            w, h, bit_depth, color_type, comp, filt, interlace = struct.unpack('>IIBBBBB', data[pos+8:pos+8+13])
        elif chunk_type == b'IDAT':
            idat.extend(data[pos+8:pos+8+length])
        pos += 8 + length + 4
    
    decompressed = zlib.decompress(idat)
    bpp = 4  # RGBA
    stride = 1 + w * bpp
    pixels = bytearray(w * h * bpp)
    prev_row = bytearray(w * bpp)
    
    def paeth_predictor(a, b, c):
        p = a + b - c
        pa = abs(p - a)
        pb = abs(p - b)
        pc = abs(p - c)
        if pa <= pb and pa <= pc:
            return a
        elif pb <= pc:
            return b
        else:
            return c

    for y in range(h):
        filter_type = decompressed[y * stride]
        row_src = decompressed[y * stride + 1 : (y + 1) * stride]
        curr_row = bytearray(w * bpp)
        for x in range(w * bpp):
            filt_val = row_src[x]
            left = curr_row[x - bpp] if x >= bpp else 0
            up = prev_row[x]
            up_left = prev_row[x - bpp] if x >= bpp else 0
            
            if filter_type == 0:
                val = filt_val
            elif filter_type == 1:
                val = (filt_val + left) & 0xff
            elif filter_type == 2:
                val = (filt_val + up) & 0xff
            elif filter_type == 3:
                val = (filt_val + ((left + up) >> 1)) & 0xff
            elif filter_type == 4:
                val = (filt_val + paeth_predictor(left, up, up_left)) & 0xff
            else:
                raise ValueError(f'Unknown filter type {filter_type}')
            curr_row[x] = val
        pixels[y * w * bpp : (y + 1) * w * bpp] = curr_row
        prev_row = curr_row
    return w, h, pixels

def make_png(width, height, pixels):
    raw_scanlines = bytearray()
    stride = width * 4
    for y in range(height):
        raw_scanlines.append(0)
        raw_scanlines.extend(pixels[y * stride : (y + 1) * stride])
    
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = binascii.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    srgb_data = b'\x00'
    srgb_crc = binascii.crc32(b'sRGB' + srgb_data)
    srgb_chunk = struct.pack('>I', 1) + b'sRGB' + srgb_data + struct.pack('>I', srgb_crc)

    compressed = zlib.compress(bytes(raw_scanlines), level=9)
    idat_crc = binascii.crc32(b'IDAT' + compressed)
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)

    iend_crc = binascii.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)

    return b'\x89PNG\r\n\x1a\n' + ihdr_chunk + srgb_chunk + idat_chunk + iend_chunk

def composite_on_black(w, h, pixels):
    out = bytearray(w * h * 4)
    for i in range(0, len(pixels), 4):
        r = pixels[i]
        g = pixels[i+1]
        b = pixels[i+2]
        a = pixels[i+3]
        if a == 0:
            out[i] = 0
            out[i+1] = 0
            out[i+2] = 0
            out[i+3] = 255
        elif a == 255:
            out[i] = r
            out[i+1] = g
            out[i+2] = b
            out[i+3] = 255
        else:
            alpha = a / 255.0
            out[i] = int(round(r * alpha))
            out[i+1] = int(round(g * alpha))
            out[i+2] = int(round(b * alpha))
            out[i+3] = 255
    return out

def resize_bilinear(src_w, src_h, src_pixels, dst_w, dst_h):
    dst = bytearray(dst_w * dst_h * 4)
    x_ratio = float(src_w - 1) / dst_w if dst_w > 1 else 0
    y_ratio = float(src_h - 1) / dst_h if dst_h > 1 else 0
    
    for y in range(dst_h):
        src_y = int(y_ratio * y)
        y_diff = (y_ratio * y) - src_y
        for x in range(dst_w):
            src_x = int(x_ratio * x)
            x_diff = (x_ratio * x) - src_x
            
            idx = (src_y * src_w + src_x) * 4
            idx_right = idx + 4 if src_x < src_w - 1 else idx
            idx_down = idx + src_w * 4 if src_y < src_h - 1 else idx
            idx_down_right = idx_down + 4 if src_x < src_w - 1 else idx_down
            
            for c in range(4):
                a = src_pixels[idx + c]
                b = src_pixels[idx_right + c]
                c_val = src_pixels[idx_down + c]
                d = src_pixels[idx_down_right + c]
                
                val = int(round(
                    a * (1 - x_diff) * (1 - y_diff) +
                    b * x_diff * (1 - y_diff) +
                    c_val * (1 - x_diff) * y_diff +
                    d * x_diff * y_diff
                ))
                dst[(y * dst_w + x) * 4 + c] = min(255, max(0, val))
    return dst

def scale_and_center_on_black(src_w, src_h, src_pixels, target_w, target_h, scale_factor=0.80):
    scaled_w = int(round(target_w * scale_factor))
    scaled_h = int(round(target_h * scale_factor))
    scaled_w = scaled_w if scaled_w % 2 == 0 else scaled_w + 1
    scaled_h = scaled_h if scaled_h % 2 == 0 else scaled_h + 1
    
    scaled_px = resize_bilinear(src_w, src_h, src_pixels, scaled_w, scaled_h)
    
    out = bytearray(target_w * target_h * 4)
    for i in range(0, len(out), 4):
        out[i] = 0
        out[i+1] = 0
        out[i+2] = 0
        out[i+3] = 255
        
    offset_x = (target_w - scaled_w) // 2
    offset_y = (target_h - scaled_h) // 2
    
    for y in range(scaled_h):
        for x in range(scaled_w):
            src_idx = (y * scaled_w + x) * 4
            dst_idx = ((y + offset_y) * target_w + (x + offset_x)) * 4
            r = scaled_px[src_idx]
            g = scaled_px[src_idx+1]
            b = scaled_px[src_idx+2]
            a = scaled_px[src_idx+3]
            if a == 255:
                out[dst_idx] = r
                out[dst_idx+1] = g
                out[dst_idx+2] = b
                out[dst_idx+3] = 255
            elif a > 0:
                alpha = a / 255.0
                out[dst_idx] = int(round(r * alpha))
                out[dst_idx+1] = int(round(g * alpha))
                out[dst_idx+2] = int(round(b * alpha))
                out[dst_idx+3] = 255
    return out

if __name__ == '__main__':
    orig_w, orig_h, orig_px = decode_png('public/icon-512.png')

    # 1. icon-512.png
    px512_black = composite_on_black(512, 512, orig_px)
    with open('public/icon-512.png', 'wb') as f:
        f.write(make_png(512, 512, px512_black))

    # 2. icon-maskable-512.png
    px_maskable = scale_and_center_on_black(orig_w, orig_h, orig_px, 512, 512, 0.80)
    with open('public/icon-maskable-512.png', 'wb') as f:
        f.write(make_png(512, 512, px_maskable))

    # 3. icon-192.png
    px192_resized = resize_bilinear(512, 512, orig_px, 192, 192)
    px192_black = composite_on_black(192, 192, px192_resized)
    with open('public/icon-192.png', 'wb') as f:
        f.write(make_png(192, 192, px192_black))

    # 4. apple-touch-icon.png
    px180_resized = resize_bilinear(512, 512, orig_px, 180, 180)
    px180_black = composite_on_black(180, 180, px180_resized)
    with open('public/apple-touch-icon.png', 'wb') as f:
        f.write(make_png(180, 180, px180_black))
