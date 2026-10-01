import React, { useState } from 'react';
import {
  INITIAL_CARPARKS,
  INITIAL_ERP_GANTRIES,
  INITIAL_USER_VEHICLE,
  INITIAL_ACTIVE_SESSION
} from './data/mockData.ts';
import { Carpark, UserVehicle } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { MapView } from './components/MapView.tsx';
import { ListView } from './components/ListView.tsx';
import { CarparkDetails } from './components/CarparkDetails.tsx';
import { ErpAndAlertsView } from './components/ErpAndAlertsView.tsx';
import { SavedView } from './components/SavedView.tsx';
import { NavigationModal } from './components/NavigationModal.tsx';
import { FindMyCarModal } from './components/FindMyCarModal.tsx';
import { TopUpModal } from './components/TopUpModal.tsx';
import { FilterModal, FilterOptions } from './components/FilterModal.tsx';
import { QueueCameraModal } from './components/QueueCameraModal.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { PhotoPreviewModal } from './components/PhotoPreviewModal.tsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'map' | 'list' | 'saved' | 'erp'>('list');
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [selectedMapCarpark, setSelectedMapCarpark] = useState<Carpark>(INITIAL_CARPARKS[1]); // ION Orchard
  const [activeDetailsCarpark, setActiveDetailsCarpark] = useState<Carpark | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['taka']);
  const [vehicle, setVehicle] = useState<UserVehicle>(INITIAL_USER_VEHICLE);
  const [session, setSession] = useState(INITIAL_ACTIVE_SESSION);
  const [gantries] = useState(INITIAL_ERP_GANTRIES);

  // Modals state
  const [navigationCarpark, setNavigationCarpark] = useState<Carpark | null>(null);
  const [showFindMyCar, setShowFindMyCar] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [queueCamCarpark, setQueueCamCarpark] = useState<Carpark | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);
  const [appToast, setAppToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setAppToast(message);
    setTimeout(() => {
      setAppToast(null);
    }, 2400);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      const target = carparks.find((c) => c.id === id);
      showToast(
        exists
          ? `Removed ${target?.name || 'carpark'} from saved`
          : `Saved ${target?.name || 'carpark'} to favorites`
      );
      return updated;
    });
  };

  const handleStartNavigation = (carpark: Carpark) => {
    setNavigationCarpark(carpark);
  };

  const handleOpenExternalMaps = (carpark: Carpark) => {
    const lat = carpark.lat;
    const lng = carpark.lng;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
      carpark.name
    )}`;
    window.open(mapsUrl, '_blank');
  };

  const handleShareCarpark = (carpark: Carpark) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check real-time lot availability for ${carpark.name} on ParkFinder SG: ${carpark.availableLots} lots available now!`
      );
    }
    showToast(`Carpark link copied: ${carpark.name}`);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    let filtered = [...INITIAL_CARPARKS];
    if (filters.type === 'hdb') {
      filtered = filtered.filter((c) => c.type.includes('HDB'));
    } else if (filters.type === 'mall') {
      filtered = filtered.filter((c) => c.type.includes('MALL') || c.type.includes('COMMERCIAL'));
    } else if (filters.type === 'ura') {
      filtered = filtered.filter((c) => c.type.includes('URA'));
    }

    filtered = filtered.filter((c) => {
      const rate = c.publishedTariffs[0]?.ratePerHour || 3.0;
      return rate <= filters.maxRate;
    });

    filtered = filtered.filter((c) => c.heightClearance >= filters.minClearance);

    if (filters.hasEv) {
      filtered = filtered.filter((c) => c.evTotal > 0);
    }

    if (filters.graceOnly) {
      filtered = filtered.filter((c) => c.gracePeriodMinutes >= 10);
    }

    setCarparks(filtered);
    showToast(`Filters applied: ${filtered.length} carparks found`);
  };

  const handleTopUpConfirm = (amount: number) => {
    setVehicle((prev) => ({
      ...prev,
      netsBalance: prev.netsBalance + amount
    }));
    showToast(`Successfully added $${amount}.00 to NETS Motoring Card`);
  };

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      {/* App Header */}
      <Header
        currentTab={currentTab}
        isDetailsView={activeDetailsCarpark !== null}
        onBackFromDetails={() => setActiveDetailsCarpark(null)}
        onOpenSearch={() => {
          setCurrentTab('list');
          setActiveDetailsCarpark(null);
        }}
        onOpenProfile={() => setShowProfile(true)}
        onShare={() => activeDetailsCarpark && handleShareCarpark(activeDetailsCarpark)}
      />

      {/* Global App Toast */}
      {appToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary text-on-primary text-body-sm font-medium shadow-2xl z-50 animate-bounce">
          {appToast}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full bg-surface pt-20">
        {activeDetailsCarpark !== null ? (
          <CarparkDetails
            carpark={activeDetailsCarpark}
            onBack={() => setActiveDetailsCarpark(null)}
            onStartNavigation={handleStartNavigation}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(activeDetailsCarpark.id)}
            onPreviewPhoto={(url, title) => setPreviewPhoto({ url, title })}
          />
        ) : currentTab === 'map' ? (
          <MapView
            carparks={carparks}
            selectedCarpark={selectedMapCarpark}
            onSelectCarpark={(c) => setSelectedMapCarpark(c)}
            onOpenDetails={(c) => setActiveDetailsCarpark(c)}
            onStartNavigation={handleStartNavigation}
            onOpenExternalMaps={handleOpenExternalMaps}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onOpenFilter={() => setShowFilter(true)}
          />
        ) : currentTab === 'list' ? (
          <ListView
            carparks={carparks}
            onSelectCarpark={(c) => {
              setSelectedMapCarpark(c);
              setActiveDetailsCarpark(c);
            }}
            onOpenDetails={(c) => setActiveDetailsCarpark(c)}
            onStartNavigation={handleStartNavigation}
            onShareCarpark={handleShareCarpark}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onOpenFilter={() => setShowFilter(true)}
            onOpenQueueCamera={(c) => setQueueCamCarpark(c)}
          />
        ) : currentTab === 'saved' ? (
          <SavedView
            carparks={carparks}
            favorites={favorites}
            onSelectCarpark={(c) => {
              setSelectedMapCarpark(c);
              setActiveDetailsCarpark(c);
            }}
            onOpenDetails={(c) => setActiveDetailsCarpark(c)}
            onStartNavigation={handleStartNavigation}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : (
          <ErpAndAlertsView
            session={session}
            vehicle={vehicle}
            gantries={gantries}
            onFindMyCar={() => setShowFindMyCar(true)}
            onOpenTopUp={() => setShowTopUp(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {activeDetailsCarpark === null && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setActiveDetailsCarpark(null);
          }}
          savedCount={favorites.length}
          hasActiveSession={true}
        />
      )}

      {/* Modals & Overlays */}
      {navigationCarpark && (
        <NavigationModal
          carpark={navigationCarpark}
          onClose={() => setNavigationCarpark(null)}
        />
      )}

      {showFindMyCar && (
        <FindMyCarModal
          session={session}
          onClose={() => setShowFindMyCar(false)}
        />
      )}

      {showTopUp && (
        <TopUpModal
          currentBalance={vehicle.netsBalance}
          onTopUp={handleTopUpConfirm}
          onClose={() => setShowTopUp(false)}
        />
      )}

      {showFilter && (
        <FilterModal
          onApplyFilters={handleApplyFilters}
          onClose={() => setShowFilter(false)}
        />
      )}

      {queueCamCarpark && (
        <QueueCameraModal
          carpark={queueCamCarpark}
          onClose={() => setQueueCamCarpark(null)}
          onSwitchAlternative={() => {
            setQueueCamCarpark(null);
            const ion = carparks.find((c) => c.id === 'ion');
            if (ion) setActiveDetailsCarpark(ion);
          }}
        />
      )}

      {showProfile && (
        <UserProfileModal
          vehicle={vehicle}
          onClose={() => setShowProfile(false)}
          onOpenTopUp={() => setShowTopUp(true)}
        />
      )}

      {previewPhoto && (
        <PhotoPreviewModal
          url={previewPhoto.url}
          title={previewPhoto.title}
          onClose={() => setPreviewPhoto(null)}
        />
      )}
    </div>
  );
}
