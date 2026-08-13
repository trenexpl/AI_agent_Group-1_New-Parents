import React, { useState } from 'react';
import { CreditPackage, UserProfile } from '../types';
import { ShieldCheck, Lock, CreditCard, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Smartphone, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface StripeCheckoutModalProps {
  pkg: CreditPackage;
  user: UserProfile | null;
  onSuccess: (creditsToAdd: number, packageName: string) => void;
  onClose: () => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  pkg,
  user,
  onSuccess,
  onClose,
}) => {
  const totalCredits = pkg.credits + pkg.bonusCredits;
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paynow'>('card');
  const [email, setEmail] = useState(user?.email || 'alex.johnson@example.com');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('242');
  const [nameOnCard, setNameOnCard] = useState(user?.name || 'Alex Johnson');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const finalPrice = Math.max(0, pkg.priceSGD - appliedDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'HAPPY10' || promoCode.trim().toUpperCase() === 'STRIPE10') {
      setAppliedDiscount(10);
      setPromoSuccess('SGD $10.00 Promo Discount Applied!');
    } else {
      setPromoError('Invalid promo code. Try "HAPPY10"');
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate real Stripe network authorization request
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        onSuccess(totalCredits, pkg.name);
      }, 1500);
    }, 1500);
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('08/29');
    setCvc('888');
    setNameOnCard(user?.name || 'Happy Parent');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a2540]/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-[#e6ebf1] my-auto">
        {/* Authentic Stripe Header Bar */}
        <div className="bg-[#0a2540] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Cancel payment and return"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-xl tracking-tight">stripe</span>
              <span className="text-[10px] bg-[#635bff] text-white font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                CHECKOUT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/80">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold hidden sm:inline">256-Bit TLS Encrypted</span>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
              TEST MODE
            </span>
          </div>
        </div>

        {paymentSuccess ? (
          <div className="p-10 text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#0a2540]">Payment Authorized!</h3>
              <p className="text-sm text-[#425466] font-medium">
                SGD ${finalPrice}.00 charged successfully via Stripe Gateway.
              </p>
            </div>

            <div className="bg-[#f6f9fc] border border-[#e6ebf1] rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2 shadow-xs">
              <div className="flex justify-between items-center text-xs text-[#7c8b9e]">
                <span>Transaction ID</span>
                <span className="font-mono text-[#0a2540] font-bold">ch_3M{Math.random().toString(36).substring(2, 9)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#7c8b9e]">
                <span>Package</span>
                <span className="font-bold text-[#635bff]">{pkg.name}</span>
              </div>
              <div className="border-t border-[#e6ebf1] pt-2 flex justify-between items-center">
                <span className="text-xs font-bold text-[#0a2540]">Credits Deposited</span>
                <span className="text-base font-black text-emerald-600">+{totalCredits} Credits</span>
              </div>
            </div>

            <p className="text-xs text-[#7c8b9e] animate-pulse">Returning to Happy Parents app...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#e6ebf1]">
            {/* Left Column: Order Summary */}
            <div className="md:col-span-5 bg-[#f6f9fc] p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Merchant Branding */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0042c8] text-white font-black text-sm flex items-center justify-center shadow-md">
                    HP
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0a2540]">Happy Parents SG</h4>
                    <p className="text-xs text-[#7c8b9e]">Class & Workshop Credits</p>
                  </div>
                </div>

                {/* Line Item */}
                <div className="border-t border-[#e6ebf1] pt-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-[#7c8b9e] uppercase tracking-wider">Purchase Details</p>
                    <p className="text-lg font-black text-[#0a2540] mt-0.5">{pkg.name}</p>
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 border border-[#e6ebf1] space-y-2 shadow-2xs">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#425466]">Base Class Credits</span>
                      <span className="font-bold text-[#0a2540]">{pkg.credits} cr</span>
                    </div>
                    {pkg.bonusCredits > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-600 font-bold">Bonus Reward</span>
                        <span className="font-black text-emerald-600">+{pkg.bonusCredits} cr</span>
                      </div>
                    )}
                    <div className="border-t border-[#e6ebf1] pt-2 flex justify-between text-xs font-black text-[#635bff]">
                      <span>Total Account Credits</span>
                      <span>{totalCredits} Credits</span>
                    </div>
                  </div>

                  {/* Promo Code Toggle */}
                  <div>
                    {!showPromoInput ? (
                      <button
                        type="button"
                        onClick={() => setShowPromoInput(true)}
                        className="text-xs text-[#635bff] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5" /> Add promotion code
                      </button>
                    ) : (
                      <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-1">
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Promo Code (e.g. HAPPY10)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-[#d8e2ec] rounded-lg text-xs font-mono uppercase text-[#0a2540]"
                          />
                          <button
                            type="submit"
                            className="bg-[#0a2540] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#635bff] transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && <p className="text-[11px] text-red-500 font-medium">{promoError}</p>}
                        {promoSuccess && <p className="text-[11px] text-emerald-600 font-bold">{promoSuccess}</p>}
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="pt-4 border-t border-[#e6ebf1] space-y-1">
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-SGD ${appliedDiscount}.00</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-[#425466]">Total Due Now</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#0a2540]">SGD ${finalPrice}</span>
                    <span className="text-xs font-semibold text-[#7c8b9e]">.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Stripe Payment Form */}
            <div className="md:col-span-7 p-6 space-y-5">
              {/* Express Payment Method Tabs */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold text-[#425466] uppercase tracking-wider">
                  Express Checkout Options
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#635bff] bg-[#635bff]/5 text-[#635bff] shadow-2xs'
                        : 'border-[#d8e2ec] text-[#425466] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'applepay'
                        ? 'border-black bg-black text-white shadow-2xs'
                        : 'border-[#d8e2ec] text-[#425466] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paynow')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'paynow'
                        ? 'border-[#be0027] bg-[#be0027]/5 text-[#be0027] shadow-2xs'
                        : 'border-[#d8e2ec] text-[#425466] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <span className="font-black tracking-tight">PayNow</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'applepay' ? (
                <div className="p-6 bg-[#f8fafc] border border-[#d8e2ec] rounded-2xl text-center space-y-3">
                  <Smartphone className="w-10 h-10 text-black mx-auto" />
                  <h4 className="text-sm font-bold text-[#0a2540]">Apple Pay Selected</h4>
                  <p className="text-xs text-[#7c8b9e]">
                    Click below to authorize SGD ${finalPrice}.00 using Touch ID or Face ID on your device.
                  </p>
                  <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full bg-black text-white font-extrabold text-sm py-3 rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">Authorizing Apple Pay...</span>
                    ) : (
                      <span>Pay with Pay</span>
                    )}
                  </button>
                </div>
              ) : paymentMethod === 'paynow' ? (
                <div className="p-6 bg-[#f8fafc] border border-[#d8e2ec] rounded-2xl text-center space-y-3">
                  <div className="w-10 h-10 bg-[#be0027] text-white font-black rounded-lg flex items-center justify-center mx-auto text-xs">
                    PN
                  </div>
                  <h4 className="text-sm font-bold text-[#0a2540]">PayNow SG QR Code</h4>
                  <p className="text-xs text-[#7c8b9e]">
                    Scan QR code using DBS PayLah!, OCBC Digital, UOB TMRW or GrabPay.
                  </p>
                  <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full bg-[#be0027] text-white font-extrabold text-sm py-3 rounded-xl hover:bg-[#9c0020] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">Verifying PayNow Transfer...</span>
                    ) : (
                      <span>Simulate PayNow Confirmation</span>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePay} className="space-y-3.5">
                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-[#425466] uppercase tracking-wider block">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#d8e2ec] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff] focus:bg-white outline-hidden font-medium"
                    />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-extrabold text-[#425466] uppercase tracking-wider block">
                        Card Information
                      </label>
                      <button
                        type="button"
                        onClick={handleFillTestCard}
                        className="text-[10px] text-[#635bff] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-Fill Stripe 4242
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-3 pr-16 py-2.5 bg-[#f8fafc] border border-[#d8e2ec] rounded-t-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff] focus:bg-white outline-hidden font-mono"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-[#7c8b9e]">
                        <span>VISA</span>
                        <span>MC</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-0 -mt-1">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                        placeholder="MM / YY"
                        className="px-3 py-2.5 bg-[#f8fafc] border border-[#d8e2ec] rounded-bl-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff] focus:bg-white outline-hidden font-mono"
                      />
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                        placeholder="CVC"
                        className="px-3 py-2.5 bg-[#f8fafc] border border-l-0 border-[#d8e2ec] rounded-br-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff] focus:bg-white outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* Name on Card */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-[#425466] uppercase tracking-wider block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#d8e2ec] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff] focus:bg-white outline-hidden font-medium"
                    />
                  </div>

                  {/* Billing Country */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-[#425466] uppercase tracking-wider block">
                      Country or Region
                    </label>
                    <select className="w-full px-3 py-2 bg-[#f8fafc] border border-[#d8e2ec] rounded-xl text-xs text-[#0a2540] focus:ring-2 focus:ring-[#635bff] focus:bg-white outline-hidden font-medium">
                      <option value="SG">Singapore 🇸🇬</option>
                      <option value="MY">Malaysia 🇲🇾</option>
                      <option value="US">United States 🇺🇸</option>
                    </select>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#635bff] hover:bg-[#0a2540] text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing with Stripe...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay SGD ${finalPrice}.00</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-[#7c8b9e]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Powered by Stripe. Secured with TLS & PCI-DSS Compliance.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

