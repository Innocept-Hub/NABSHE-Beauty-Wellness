import React, { useState, useEffect } from 'react';
import {
  Language,
  ScreenType,
  Treatment,
  CuratedPackage,
  BoutiqueProduct,
  CartItem,
  UserProfile,
  AppointmentRequest,
  BoutiqueOrder,
} from './types';
import {
  TREATMENTS,
  BOUTIQUE_PRODUCTS,
  INITIAL_USER_PROFILE,
  INITIAL_APPOINTMENTS,
  INITIAL_BOUTIQUE_ORDERS,
} from './data/mockData';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { CuratedPackagesScreen } from './components/CuratedPackagesScreen';
import { TreatmentDetailScreen } from './components/TreatmentDetailScreen';
import { BookingFlowScreen } from './components/BookingFlowScreen';
import { RequestReceivedScreen } from './components/RequestReceivedScreen';
import { ShopScreen } from './components/ShopScreen';
import { CartModal } from './components/CartModal';
import { OrderConfirmationScreen } from './components/OrderConfirmationScreen';
import { RequestsScreen } from './components/RequestsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SearchScreen } from './components/SearchScreen';
import { VipMembershipScreen } from './components/VipMembershipScreen';
import { SanctuaryStoryScreen } from './components/SanctuaryStoryScreen';
import { ArtisansScreen } from './components/ArtisansScreen';
import { DiagnosticScreen } from './components/DiagnosticScreen';
import { SavedScreen } from './components/SavedScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { PWAInstallModal } from './components/PWAInstallModal';
import { useScrollReveal } from './utils/useScrollReveal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment>(TREATMENTS[0]);
  const [selectedProduct, setSelectedProduct] = useState<BoutiqueProduct>(BOUTIQUE_PRODUCTS[0]);
  const [bookingAddonIds, setBookingAddonIds] = useState<string[]>([]);
  const [bookingCalculatedPrice, setBookingCalculatedPrice] = useState<number>(TREATMENTS[0].price);
  const [bookingSpecialist, setBookingSpecialist] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(INITIAL_APPOINTMENTS);
  const [latestAppointment, setLatestAppointment] = useState<AppointmentRequest>(INITIAL_APPOINTMENTS[0]);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState<boolean>(false);

  // Initial cart with boutique products matching user appointment visit
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: BOUTIQUE_PRODUCTS[1], // Rose Damascena Restorative Hair Oil (50ml - AED 280)
      quantity: 1,
    },
    {
      product: BOUTIQUE_PRODUCTS[0], // 24K Gold Cellular Lifting Serum (30ml - AED 490)
      quantity: 1,
    },
  ]);
  const [linkedAppointment, setLinkedAppointment] = useState<{
    serviceNameEn: string;
    serviceNameAr: string;
    dateTimeStr: string;
    price: number;
  } | null>({
    serviceNameEn: 'Botanical Enzyme Clarifying Facial',
    serviceNameAr: 'جلسة إنزيمات النباتات للتنقية العميقة',
    dateTimeStr: 'Tue, 29 Sep 2026 at 04:00 PM',
    price: 420,
  });
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const [orders, setOrders] = useState<BoutiqueOrder[]>(INITIAL_BOUTIQUE_ORDERS);
  const [latestOrder, setLatestOrder] = useState<BoutiqueOrder>(INITIAL_BOUTIQUE_ORDERS[0]);

  // Activate luxury smooth scroll-reveal animations across all views
  useScrollReveal([activeScreen]);

  // Saved / Wishlist items with hypothetical luxury services & boutique products preloaded
  const [savedTreatmentIds, setSavedTreatmentIds] = useState<string[]>([
    'facial-24k-gold',
    'hair-caviar-peptide',
  ]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([
    'prod-24k-gold-serum',
    'prod-rose-hair-oil',
  ]);

  const handleToggleSaveTreatment = (id: string) => {
    setSavedTreatmentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSaveProduct = (id: string) => {
    setSavedProductIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleClearSaved = () => {
    setSavedTreatmentIds([]);
    setSavedProductIds([]);
  };

  // Update HTML document direction and lang attribute whenever language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Scroll to top on screen transitions
  const navigateTo = (screen: ScreenType) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setBookingAddonIds([]);
    setBookingCalculatedPrice(treatment.price);
    navigateTo('treatment-detail');
  };

  const handleSelectProduct = (product: BoutiqueProduct) => {
    setSelectedProduct(product);
    navigateTo('product-detail');
  };

  const handleProceedToBooking = (
    treatment: Treatment,
    addedProductIds: string[],
    calculatedPrice: number
  ) => {
    setSelectedTreatment(treatment);
    setBookingSpecialist(null);
    setBookingAddonIds(addedProductIds);
    setBookingCalculatedPrice(calculatedPrice);
    navigateTo('booking');
  };

  const handleBookingConfirmed = (newAppointment: AppointmentRequest) => {
    setAppointments(prev => [newAppointment, ...prev]);
    setLatestAppointment(newAppointment);
    setLinkedAppointment({
      serviceNameEn: newAppointment.treatmentTitleEn,
      serviceNameAr: newAppointment.treatmentTitleAr,
      dateTimeStr: newAppointment.dateStr,
      price: newAppointment.price,
    });
    navigateTo('request-received');
  };

  const handlePackageRequested = (pkg: CuratedPackage, windowSlot: string) => {
    const newRef = `NAB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newAppointment: AppointmentRequest = {
      id: `apt-${crypto.randomUUID()}`,
      refNumber: newRef,
      treatmentTitleEn: pkg.titleEn,
      treatmentTitleAr: pkg.titleAr,
      treatmentImage: pkg.imageUrl,
      dateStr: `Thu, 27 Oct · ${windowSlot}`,
      timeStr: windowSlot,
      specialist: 'Sanctuary Team Master',
      duration: pkg.duration,
      price: pkg.price,
      statusEn: 'Sent, awaiting confirmation',
      statusAr: 'تم الإرسال، بانتظار التأكيد',
      clientName: userProfile.name,
      clientPhone: userProfile.phone,
      addOns: [`Preferred Window: ${windowSlot}`],
      totalPrice: pkg.price,
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setLatestAppointment(newAppointment);
    navigateTo('request-received');
  };

  const handleAddToCart = (product: BoutiqueProduct, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleOrderConfirmed = (newOrder: BoutiqueOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCart([]); // Clear cart
    setLinkedAppointment(null); // Clear linked appointment to prevent state leak
    navigateTo('order-confirmation');
  };

  const handleSelectSpecialistToBook = (specialistName: string, treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setBookingSpecialist(specialistName);
    setBookingAddonIds([]);
    setBookingCalculatedPrice(treatment.price);
    navigateTo('booking');
  };

  const handleSelectDiagnosticTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setBookingAddonIds([]);
    setBookingCalculatedPrice(treatment.price);
    navigateTo('booking');
  };

  const handleResetData = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setAppointments([]);
    setOrders([]);
    setCart([]);
    navigateTo('home');
  };

  const isBottomNavVisible =
    activeScreen !== 'booking' &&
    activeScreen !== 'treatment-detail' &&
    activeScreen !== 'product-detail' &&
    !isPackageModalOpen &&
    !isCartModalOpen &&
    !isMobileMenuOpen;

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] font-sans antialiased selection:bg-[#f2ca50] selection:text-[#241a00] flex flex-col justify-between">
      {/* Top Fixed Header with Bilingual Toggle & Profile Shortcut */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={navigateTo}
        activeScreen={activeScreen}
        onOpenSearch={() => navigateTo('search')}
        savedCount={savedTreatmentIds.length + savedProductIds.length}
        onMobileMenuChange={setIsMobileMenuOpen}
      />

      {/* Main Screen Viewport Container (Fluid Responsive Layout) */}
      <main className="w-full max-w-7xl mx-auto pt-[67px] sm:pt-[68px] md:pt-[78px] lg:pt-[88px] xl:pt-[92px] flex-1 flex flex-col">
        {activeScreen === 'home' && (
          <HomeScreen
            language={language}
            onNavigate={navigateTo}
            onSelectTreatment={handleSelectTreatment}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            savedTreatmentIds={savedTreatmentIds}
            savedProductIds={savedProductIds}
            onToggleSaveTreatment={handleToggleSaveTreatment}
            onToggleSaveProduct={handleToggleSaveProduct}
          />
        )}

        {activeScreen === 'services' && (
          <ServicesScreen
            language={language}
            onNavigate={navigateTo}
            onSelectTreatment={handleSelectTreatment}
            savedTreatmentIds={savedTreatmentIds}
            onToggleSaveTreatment={handleToggleSaveTreatment}
          />
        )}

        {activeScreen === 'packages' && (
          <CuratedPackagesScreen
            language={language}
            onNavigate={navigateTo}
            onRequestSubmitted={handlePackageRequested}
            onModalChange={setIsPackageModalOpen}
          />
        )}

        {activeScreen === 'treatment-detail' && (
          <TreatmentDetailScreen
            treatment={selectedTreatment}
            language={language}
            onNavigate={navigateTo}
            onProceedToBooking={handleProceedToBooking}
            isSaved={savedTreatmentIds.includes(selectedTreatment.id)}
            onToggleSave={handleToggleSaveTreatment}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'product-detail' && (
          <ProductDetailScreen
            product={selectedProduct}
            language={language}
            onNavigate={navigateTo}
            onAddToCart={handleAddToCart}
            onOpenCartModal={() => setIsCartModalOpen(true)}
            isSaved={savedProductIds.includes(selectedProduct.id)}
            onToggleSave={handleToggleSaveProduct}
            allProducts={BOUTIQUE_PRODUCTS}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'booking' && (
          <BookingFlowScreen
            treatment={selectedTreatment}
            initialAddonIds={bookingAddonIds}
            initialPrice={bookingCalculatedPrice}
            initialSpecialist={bookingSpecialist}
            userProfile={userProfile}
            language={language}
            onNavigate={navigateTo}
            onBookingConfirmed={handleBookingConfirmed}
          />
        )}

        {activeScreen === 'request-received' && (
          <RequestReceivedScreen
            appointment={latestAppointment}
            language={language}
            onNavigate={navigateTo}
          />
        )}

        {activeScreen === 'shop' && (
          <ShopScreen
            language={language}
            onNavigate={navigateTo}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCartModal={() => setIsCartModalOpen(true)}
            savedProductIds={savedProductIds}
            onToggleSaveProduct={handleToggleSaveProduct}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'saved' && (
          <SavedScreen
            language={language}
            onNavigate={navigateTo}
            savedTreatmentIds={savedTreatmentIds}
            savedProductIds={savedProductIds}
            onToggleSaveTreatment={handleToggleSaveTreatment}
            onToggleSaveProduct={handleToggleSaveProduct}
            onSelectTreatment={handleSelectTreatment}
            onAddToCart={handleAddToCart}
            onClearSaved={handleClearSaved}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'order-confirmation' && (
          <OrderConfirmationScreen
            order={latestOrder}
            language={language}
            onNavigate={navigateTo}
          />
        )}

        {activeScreen === 'requests' && (
          <RequestsScreen
            language={language}
            onNavigate={navigateTo}
            appointments={appointments}
            orders={orders}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onResetData={handleResetData}
            language={language}
            onNavigate={navigateTo}
            pendingAptCount={appointments.length}
            pendingOrderCount={orders.length}
          />
        )}

        {activeScreen === 'search' && (
          <SearchScreen
            language={language}
            onNavigate={navigateTo}
            onSelectTreatment={handleSelectTreatment}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'vip' && (
          <VipMembershipScreen
            userProfile={userProfile}
            language={language}
            onNavigate={navigateTo}
          />
        )}

        {activeScreen === 'story' && (
          <SanctuaryStoryScreen
            language={language}
            onNavigate={navigateTo}
          />
        )}

        {activeScreen === 'artisans' && (
          <ArtisansScreen
            language={language}
            onNavigate={navigateTo}
            onSelectSpecialistToBook={handleSelectSpecialistToBook}
          />
        )}

        {activeScreen === 'diagnostic' && (
          <DiagnosticScreen
            language={language}
            onNavigate={navigateTo}
            onSelectTreatmentToBook={handleSelectDiagnosticTreatment}
          />
        )}
      </main>

      {/* Cart Modal Sheet */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        userProfile={userProfile}
        language={language}
        onOrderConfirmed={handleOrderConfirmed}
        currentScreen={activeScreen}
        onNavigate={navigateTo}
        linkedAppointment={linkedAppointment}
        onUnlinkAppointment={() => setLinkedAppointment(null)}
      />

      {/* Bottom Sticky Navigation Bar - Hidden on dedicated booking, service detail, product detail, package modal & when cart modal or mobile menu is open */}
      {isBottomNavVisible && (
        <BottomNav
          activeScreen={activeScreen}
          onNavigate={navigateTo}
          language={language}
          pendingRequestsCount={appointments.length + orders.length}
          onOpenCart={() => setIsCartModalOpen(true)}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        />
      )}

      {/* Global PWA Install Bottom Sheet Modal - Renders above BottomNav */}
      <PWAInstallModal
        language={language}
        isBottomNavVisible={isBottomNavVisible}
      />
    </div>
  );
}
