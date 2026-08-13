import React, { useState } from 'react';
import { UserProfile, CreditPackage } from '../types';
import { creditPackages } from '../data/mockData';
import { Check, Sparkles, CreditCard, ShieldCheck, Zap, Lock } from 'lucide-react';
import { StripeCheckoutModal } from './StripeCheckoutModal';

interface CreditsViewProps {
  user: UserProfile | null;
  onAddCredits: (amount: number, packageName: string) => void;
}

export const CreditsView: React.FC<CreditsViewProps> = ({ user, onAddCredits }) => {
  const [selectedPkg, setSelectedPkg] = useState<CreditPackage>(creditPackages[1]);
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutModalPkg, setCheckoutModalPkg] = useState<CreditPackage | null>(null);

  const handleBuy = async (pkg: CreditPackage) => {
    setPurchasing(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: pkg.name,
          credits: pkg.credits + pkg.bonusCredits,
          priceSGD: pkg.priceSGD,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect directly to official Stripe Checkout Page
        window.location.href = data.url;
      } else {
        // Open Stripe Payment Page modal
        setCheckoutModalPkg(pkg);
      }
    } catch (err) {
      console.warn('API error, launching Stripe Checkout modal:', err);
      setCheckoutModalPkg(pkg);
    } finally {
      setPurchasing(false);
    }
  };

  const handleStripeSuccess = (creditsToAdd: number, packageName: string) => {
    onAddCredits(creditsToAdd, packageName);
    setCheckoutModalPkg(null);
  };

  const userCredits = user ? user.credits : 0;
  const renewalDate = user ? user.renewalDate : 'Next Month';
  const membership = user ? user.membership : 'Guest';

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-2xl mx-auto">
      {/* AVAILABLE BALANCE CARD */}
      <section className="bg-white rounded-xl p-6 border border-[#c3c5d9]/30 relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 bg-gradient-to-br from-[#dce1ff] via-white to-white opacity-60 z-0"></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-bold text-[#434656] uppercase tracking-wider mb-2 block">
              AVAILABLE BALANCE
            </span>
            <div className="flex items-end gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#0042c8] tracking-tight">
                {userCredits}
              </span>
              <span className="text-base font-semibold text-[#0042c8] pb-1">credits</span>
            </div>
            <p className="text-xs text-[#6B7280] mt-2 font-medium">
              Renews on {renewalDate} ({membership})
            </p>
          </div>
        </div>
      </section>

      {/* CHOOSE CREDIT PLAN */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#191c1e] tracking-tight">Choose a Credit Plan</h2>
        <div className="space-y-3">
          {creditPackages.map((pkg) => {
            const isSelected = selectedPkg.id === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex items-center justify-between ${
                  isSelected
                    ? 'border-[#0042c8] bg-[#f8f9fb] ring-2 ring-[#0042c8]/20 shadow-xs'
                    : 'border-[#c3c5d9]/30 bg-white hover:border-[#0042c8]/40'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-4 bg-[#0042c8] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {pkg.tag}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#0042c8] bg-[#0042c8] text-white' : 'border-[#c3c5d9]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191c1e]">{pkg.name}</h3>
                    <p className="text-xs text-[#434656]">
                      <strong className="text-[#0042c8] font-bold">{pkg.credits} credits</strong>{' '}
                      {pkg.bonusCredits > 0 && (
                        <span className="text-emerald-600 font-semibold">
                          (+{pkg.bonusCredits} bonus credits)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-[#191c1e]">
                    SGD ${pkg.priceSGD}
                  </span>
                  <span className="text-[11px] text-[#434656] block">/month</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => handleBuy(selectedPkg)}
          disabled={purchasing}
          className="w-full bg-[#0042c8] text-white font-bold text-sm py-3.5 rounded-full hover:bg-[#003ab2] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
        >
          {purchasing ? (
            'Processing...'
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Add {selectedPkg.credits + selectedPkg.bonusCredits} Credits for SGD ${selectedPkg.priceSGD}
            </>
          )}
        </button>
      </section>

      {/* QUICK TOP-UP PACKS */}
      <section className="bg-white rounded-xl p-5 border border-[#c3c5d9]/30 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#0042c8]" />
          <h3 className="text-sm font-bold text-[#191c1e]">Need a Quick Top-Up?</h3>
        </div>
        <p className="text-xs text-[#434656]">
          One-time credit boosts that never expire during your active subscription period.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleBuy({ id: 'top_10', name: '10 Credit Top-Up', credits: 10, bonusCredits: 0, priceSGD: 25 })}
            className="p-3 bg-[#f8f9fb] rounded-lg border border-[#c3c5d9]/30 hover:border-[#0042c8] transition-all text-left group"
          >
            <p className="text-xs font-bold text-[#0042c8] group-hover:underline">+10 Credits</p>
            <p className="text-sm font-extrabold text-[#191c1e] mt-1">SGD $25</p>
          </button>
          <button
            onClick={() => handleBuy({ id: 'top_22', name: '22 Credit Top-Up', credits: 20, bonusCredits: 2, priceSGD: 50 })}
            className="p-3 bg-[#f8f9fb] rounded-lg border border-[#c3c5d9]/30 hover:border-[#0042c8] transition-all text-left group"
          >
            <p className="text-xs font-bold text-[#0042c8] group-hover:underline">+22 Credits (+2 Bonus)</p>
            <p className="text-sm font-extrabold text-[#191c1e] mt-1">SGD $50</p>
          </button>
        </div>
      </section>

      {/* HOW CREDITS WORK */}
      <section className="bg-[#f3f4f6] rounded-xl p-5 space-y-2 border border-[#c3c5d9]/20">
        <div className="flex items-center gap-2 text-[#0042c8]">
          <ShieldCheck className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider">How Credits Work</h4>
        </div>
        <ul className="text-xs text-[#434656] space-y-1.5 list-disc pl-4">
          <li>Use credits across Pilates, Yoga, HIIT, and Kids Enrichment studios.</li>
          <li>Unused credits roll over (up to 10 credits per billing cycle).</li>
          <li>Cancel or reschedule classes up to 12 hours before start for 100% credit refund.</li>
        </ul>
      </section>

      {/* Stripe Checkout Modal */}
      {checkoutModalPkg && (
        <StripeCheckoutModal
          pkg={checkoutModalPkg}
          user={user}
          onSuccess={handleStripeSuccess}
          onClose={() => setCheckoutModalPkg(null)}
        />
      )}
    </div>
  );
};
