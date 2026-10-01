import React from 'react';

interface PhotoPreviewModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({ url, title, onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl flex flex-col cursor-default"
      >
        <div className="relative aspect-video w-full bg-black">
          <img src={url} alt={title} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-4 bg-surface-container-lowest">
          <h4 className="font-headline-sm text-headline-sm text-on-surface">{title}</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Visual reference anchor for bay and entry orientation.
          </p>
        </div>
      </div>
    </div>
  );
};
