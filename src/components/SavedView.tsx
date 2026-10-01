import React from 'react';
import { Carpark } from '../types/index.ts';

interface SavedViewProps {
  carparks: Carpark[];
  favorites: string[];
  onSelectCarpark: (carpark: Carpark) => void;
  onOpenDetails: (carpark: Carpark) => void;
  onStartNavigation: (carpark: Carpark) => void;
  onToggleFavorite: (id: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  carparks,
  favorites,
  onSelectCarpark,
  onOpenDetails,
  onStartNavigation,
  onToggleFavorite
}) => {
  const savedCarparks = carparks.filter((c) => favorites.includes(c.id));

  return (
    <div className="flex flex-col w-full px-margin pb-24 pt-space-sm gap-space-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Saved Carparks</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {savedCarparks.length} monitored location{savedCarparks.length === 1 ? '' : 's'}
          </p>
        </div>
        <span className="font-label-badge text-label-badge bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
          SYNCED
        </span>
      </div>

      {savedCarparks.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-surface-container-high/40 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-[32px]">bookmark_border</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">No Saved Carparks</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mb-4">
            Bookmark your frequent destinations from the Map or List View to monitor live availability here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {savedCarparks.map((carpark) => (
            <div
              key={carpark.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm border border-surface-container-high/40"
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => onOpenDetails(carpark)}
              >
                <div>
                  <span className="font-label-badge text-label-badge uppercase px-2 py-0.5 rounded bg-primary-container text-on-primary-container">
                    {carpark.type}
                  </span>
                  <h3 className="font-headline-sm text-[16px] text-on-surface mt-1 truncate">
                    {carpark.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {carpark.address.split(',')[0]} • {carpark.driveTimeMinutes} min drive
                  </p>
                </div>

                <div className="text-right">
                  <div
                    className={`font-label-numeric-lg text-label-numeric-lg ${
                      carpark.availableLots < 10 ? 'text-on-tertiary-container' : 'text-secondary'
                    }`}
                  >
                    {carpark.availableLots}
                  </div>
                  <span className="font-label-meta text-[11px] text-on-surface-variant">
                    lots free
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-surface-container-high/30">
                <span className="font-body-sm text-[12px] text-on-surface font-medium">
                  {carpark.standardRateText} ({carpark.gracePeriodMinutes}m grace)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleFavorite(carpark.id)}
                    className="p-1.5 text-error hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-[18px] material-symbols-fill">
                      favorite
                    </span>
                  </button>
                  <button
                    onClick={() => onStartNavigation(carpark)}
                    className="h-8 px-3 rounded-lg bg-primary text-on-primary font-label-meta text-[12px] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[14px]">turn_sharp_right</span>
                    <span>Navigate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
