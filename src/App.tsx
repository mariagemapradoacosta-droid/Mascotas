import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from './lib/firebase';

import { TopAppBar } from './components/TopAppBar';
import { HeroSection } from './components/HeroSection';
import { PetForm } from './components/PetForm';
import { PlanDashboard } from './components/PlanDashboard';
import { PsychologySection } from './components/PsychologySection';
import { PricingSection } from './components/PricingSection';
import { BookingModal } from './components/BookingModal';
import { EthologistChatModal } from './components/EthologistChatModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProfileTab } from './components/ProfileTab';
import { ExpertsTab } from './components/ExpertsTab';
import { BottomNavBar } from './components/BottomNavBar';

import { PetInfo, TrainingPlan, BookingSession, MembershipPlan, AppNotification } from './types';
import { MEMBERSHIP_PLANS, INITIAL_NOTIFICATIONS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'plan' | 'experts' | 'profile'>('home');
  const [user, setUser] = useState<User | null>(null);

  // State
  const [pets, setPets] = useState<PetInfo[]>([
    {
      name: 'Toby',
      breed: 'Golden Retriever',
      age: 2,
      weight: 25,
      behavior: 'equilibrado',
      notes: 'Muy sociable y le gusta jugar con pelotas'
    }
  ]);
  const [activePet, setActivePet] = useState<PetInfo | null>(pets[0]);
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);

  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeMembership, setActiveMembership] = useState<MembershipPlan>(MEMBERSHIP_PLANS[1]); // Plus Mensual

  // Modals & Drawers
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEthologistChatOpen, setIsEthologistChatOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState<string>('');

  // Unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync with Firestore when logged in
  useEffect(() => {
    if (!user) return;

    // Sync Pets
    const petsPath = `users/${user.uid}/pets`;
    const unsubPets = onSnapshot(
      collection(db, petsPath),
      (snapshot) => {
        const loadedPets: PetInfo[] = snapshot.docs.map((d) => d.data() as PetInfo);
        if (loadedPets.length > 0) {
          setPets(loadedPets);
          if (!activePet || !loadedPets.some((p) => p.name === activePet.name)) {
            setActivePet(loadedPets[0]);
          }
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, petsPath)
    );

    // Sync Training Plans
    const plansPath = `users/${user.uid}/trainingPlans`;
    const unsubPlans = onSnapshot(
      collection(db, plansPath),
      (snapshot) => {
        const loadedPlans: TrainingPlan[] = snapshot.docs.map((d) => d.data() as TrainingPlan);
        if (loadedPlans.length > 0) {
          setActivePlan(loadedPlans[0]);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, plansPath)
    );

    // Sync Bookings
    const bookingsPath = `users/${user.uid}/bookings`;
    const unsubBookings = onSnapshot(
      collection(db, bookingsPath),
      (snapshot) => {
        const loadedBookings: BookingSession[] = snapshot.docs.map((d) => d.data() as BookingSession);
        if (loadedBookings.length > 0) {
          setBookings(loadedBookings);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, bookingsPath)
    );

    // Sync Notifications
    const notifsPath = `users/${user.uid}/notifications`;
    const unsubNotifs = onSnapshot(
      collection(db, notifsPath),
      (snapshot) => {
        const loadedNotifs: AppNotification[] = snapshot.docs.map((d) => d.data() as AppNotification);
        if (loadedNotifs.length > 0) {
          setNotifications(loadedNotifs);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, notifsPath)
    );

    return () => {
      unsubPets();
      unsubPlans();
      unsubBookings();
      unsubNotifs();
    };
  }, [user]);

  // Auth Handlers
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // Helper to save pet to Firestore
  const savePetToFirestore = async (petData: PetInfo) => {
    if (!user) return;
    const petId = petData.name.toLowerCase().replace(/\s+/g, '_');
    const path = `users/${user.uid}/pets/${petId}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'pets', petId), {
        ...petData,
        id: petId,
        ownerId: user.uid,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  // Handle plan generation form submission
  const handleGeneratePlan = async (petData: PetInfo) => {
    setIsLoadingPlan(true);
    setActivePet(petData);

    // Save pet to list if new
    setPets((prev) => {
      const exists = prev.some((p) => p.name.toLowerCase() === petData.name.toLowerCase());
      if (exists) {
        return prev.map((p) => (p.name.toLowerCase() === petData.name.toLowerCase() ? petData : p));
      }
      return [petData, ...prev];
    });

    if (user) {
      savePetToFirestore(petData);
    }

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData)
      });

      const data = await response.json();

      if (data.success && data.plan) {
        const planObj = data.plan;
        setActivePlan(planObj);

        if (user) {
          const planId = `plan_${Date.now()}`;
          const path = `users/${user.uid}/trainingPlans/${planId}`;
          try {
            await setDoc(doc(db, 'users', user.uid, 'trainingPlans', planId), {
              ...planObj,
              id: planId,
              ownerId: user.uid,
              createdAt: new Date().toISOString()
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, path);
          }
        }

        // Add a notification for plan ready
        const newNotif: AppNotification = {
          id: `notif_${Date.now()}`,
          title: `¡Plan listo para ${petData.name}!`,
          message: `Tu plan personalizado para ${petData.breed} está generado y listo para consultar.`,
          time: 'Ahora',
          read: false,
          type: 'plan'
        };
        setNotifications((prev) => [newNotif, ...prev]);

        if (user) {
          const pathNotif = `users/${user.uid}/notifications/${newNotif.id}`;
          try {
            await setDoc(doc(db, 'users', user.uid, 'notifications', newNotif.id), {
              ...newNotif,
              ownerId: user.uid
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, pathNotif);
          }
        }

        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Toggle Schedule Tasks
  const handleToggleTask = (taskId: string) => {
    if (!activePlan) return;

    const updatedSchedule = activePlan.weeklySchedule.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const updatedPlan = {
      ...activePlan,
      weeklySchedule: updatedSchedule
    };

    setActivePlan(updatedPlan);

    if (user && activePlan.id) {
      const path = `users/${user.uid}/trainingPlans/${activePlan.id}`;
      setDoc(doc(db, 'users', user.uid, 'trainingPlans', activePlan.id), {
        ...updatedPlan,
        ownerId: user.uid
      }).catch((err) => handleFirestoreError(err, OperationType.WRITE, path));
    }
  };

  // Ask Ethologist AI with custom prompt
  const handleAskEthologist = (prompt: string) => {
    setChatPrompt(prompt);
    setIsEthologistChatOpen(true);
  };

  // Handle Booking Confirmation
  const handleConfirmBooking = async (session: BookingSession) => {
    setBookings((prev) => [session, ...prev]);
    const newNotif: AppNotification = {
      id: `notif_b_${Date.now()}`,
      title: 'Sesión 1:1 Agendada',
      message: `Has reservado cita con ${session.ethologistName} el ${session.date} a las ${session.time}.`,
      time: 'Ahora',
      read: false,
      type: 'booking'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (user) {
      const pathBooking = `users/${user.uid}/bookings/${session.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'bookings', session.id), {
          ...session,
          ownerId: user.uid,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, pathBooking);
      }

      const pathNotif = `users/${user.uid}/notifications/${newNotif.id}`;
      try {
        await setDoc(doc(db, 'users', user.uid, 'notifications', newNotif.id), {
          ...newNotif,
          ownerId: user.uid
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, pathNotif);
      }
    }
  };

  // Handle Membership Selection
  const handleSelectPlan = (membership: MembershipPlan) => {
    setActiveMembership(membership);
    setIsPricingModalOpen(false);
    const newNotif: AppNotification = {
      id: `notif_mem_${Date.now()}`,
      title: 'Membresía Actualizada',
      message: `Tu plan se ha actualizado correctamente a ${membership.name}.`,
      time: 'Ahora',
      read: false,
      type: 'tip'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (user) {
      const userProfilePath = `users/${user.uid}`;
      setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        membershipId: membership.id,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch((err) => handleFirestoreError(err, OperationType.WRITE, userProfilePath));
    }
  };

  // Mark all notifications read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b24] font-sans pb-24">
      {/* Top App Bar */}
      <TopAppBar
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenEthologistChat={() => handleAskEthologist('')}
        activePetName={activePet?.name}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="mt-16 px-4 pt-4 max-w-2xl mx-auto space-y-8">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <>
            <HeroSection />

            <PetForm onSubmit={handleGeneratePlan} isLoading={isLoadingPlan} />

            <PlanDashboard
              plan={activePlan}
              onToggleTask={handleToggleTask}
              onAskEthologist={handleAskEthologist}
            />

            <PsychologySection onOpenBooking={() => setIsBookingModalOpen(true)} />

            <PricingSection
              onSelectPlan={handleSelectPlan}
              activePlanId={activeMembership.id}
            />
          </>
        )}

        {/* TAB 2: PLAN DETAIL */}
        {activeTab === 'plan' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#3525cd] text-white p-6 rounded-2xl">
              <h2 className="text-2xl font-extrabold">Mi Plan de Adiestramiento</h2>
              <p className="text-xs text-indigo-100 mt-1">
                {activePet
                  ? `Sigue el calendario diario de ${activePet.name} (${activePet.breed})`
                  : 'Configura una mascota para ver su plan activo'}
              </p>
            </div>

            <PlanDashboard
              plan={activePlan}
              onToggleTask={handleToggleTask}
              onAskEthologist={handleAskEthologist}
            />

            {!activePlan && (
              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#3525cd] text-white px-6 py-3 rounded-xl font-bold text-xs"
                >
                  Ir al Generador de Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXPERTS */}
        {activeTab === 'experts' && (
          <ExpertsTab
            onOpenBooking={() => setIsBookingModalOpen(true)}
            onOpenEthologistChat={() => handleAskEthologist('')}
          />
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            onLogin={handleLogin}
            pets={pets}
            activePet={activePet}
            onSelectPet={(p) => setActivePet(p)}
            onNewPetClick={() => {
              setActiveTab('home');
              document.getElementById('generator-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            bookings={bookings}
            activePlan={activePlan}
            membership={activeMembership}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
        defaultPetName={activePet?.name || 'Tu perro'}
      />

      {/* Ethologist Chat Drawer/Modal */}
      <EthologistChatModal
        isOpen={isEthologistChatOpen}
        onClose={() => setIsEthologistChatOpen(false)}
        activePet={activePet}
        initialPrompt={chatPrompt}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllRead}
      />

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-[#1b1b24]">Cambiar de Membresía</h3>
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="text-[#777587] font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <PricingSection
              onSelectPlan={handleSelectPlan}
              activePlanId={activeMembership.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
