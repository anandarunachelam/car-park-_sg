import React, { useState } from 'react';

interface TopUpModalProps {
  currentBalance: number;
  onTopUp: (amount: number) => void;
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ currentBalance, onTopUp, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState(20);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onTopUp(selectedAmount);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-t-3xl shadow-2xl overflow-hidden flex flex-col p-space-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Top Up Motoring Card</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">NETS FlashPay / OBU 2.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Current Balance */}
        <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low flex items-center justify-between">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Current Balance</span>
          <span className="font-label-numeric-lg text-label-numeric-lg text-on-surface">
            ${currentBalance.toFixed(2)} SGD
          </span>
        </div>

        {/* Amount Selector */}
        <div className="mt-space-md space-y-space-xs">
          <span className="font-label-meta text-[11px] text-on-surface-variant uppercase tracking-wider">
            Select Top-Up Amount
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 50].map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`py-3 rounded-xl font-label-numeric-md text-label-numeric-md cursor-pointer transition-all ${
                  selectedAmount === amt
                    ? 'bg-primary text-on-primary shadow-md scale-102 ring-2 ring-primary-container'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                +${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Source */}
        <div className="mt-space-md p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <span className="font-body-sm text-[13px] text-on-surface">PayNow / Linked DBS Account</span>
          </div>
          <span className="font-label-meta text-[11px] text-secondary font-semibold">Auto-Debit</span>
        </div>

        {/* Submit */}
        <div className="mt-space-lg flex gap-space-sm">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface font-headline-sm text-body-md hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 py-3 rounded-xl bg-secondary text-on-secondary font-headline-sm text-body-md hover:bg-secondary-fixed-dim transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Authorizing...</span>
              </>
            ) : (
              <span>Top Up ${selectedAmount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
