import React, { useState } from 'react';
import { X, Copy, Check, Share2, Gift } from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const referralCode = 'HAPPYPARENTS-ALEX20';
  const referralLink = `https://happyparents.app/invite/${referralCode}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#434656] hover:text-black"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 bg-[#c2e0ff] text-[#0042c8] rounded-full flex items-center justify-center mx-auto">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-[#191c1e]">Refer Friends & Get SGD 20</h3>
          <p className="text-xs text-[#434656] max-w-xs mx-auto">
            Give your friends 20 bonus credits when they join Happy Parents. You&apos;ll earn SGD $20 cash credit in return!
          </p>
        </div>

        <div className="bg-[#f8f9fb] p-3 rounded-xl border border-[#c3c5d9]/30 space-y-1.5">
          <label className="text-[10px] font-bold text-[#434656] uppercase tracking-wider block">
            Your Personal Referral Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-white text-xs p-2 rounded-lg border border-[#c3c5d9]/40 text-[#191c1e] font-mono outline-hidden"
            />
            <button
              onClick={handleCopy}
              className="bg-[#0042c8] text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#003ab2] transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-[#191c1e] text-white text-xs font-bold py-3 rounded-full hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" /> Share Link with Friends
        </button>
      </div>
    </div>
  );
};
