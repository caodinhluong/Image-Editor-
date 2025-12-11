import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Shield, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  description: string;
  credits?: number;
}

type PaymentMethod = 'card' | 'momo' | 'bank' | 'zalopay';

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  amount, 
  description,
  credits 
}) => {
  const { language } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'details' | 'success'>('method');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const trans = {
    title: language === 'vi' ? 'Thanh toán' : 'Payment',
    selectMethod: language === 'vi' ? 'Chọn phương thức thanh toán' : 'Select payment method',
    card: language === 'vi' ? 'Thẻ tín dụng/ghi nợ' : 'Credit/Debit Card',
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    bank: language === 'vi' ? 'Chuyển khoản ngân hàng' : 'Bank Transfer',
    cardNumber: language === 'vi' ? 'Số thẻ' : 'Card Number',
    cardName: language === 'vi' ? 'Tên trên thẻ' : 'Name on Card',
    expiry: language === 'vi' ? 'Ngày hết hạn' : 'Expiry Date',
    cvv: 'CVV',
    orderSummary: language === 'vi' ? 'Tóm tắt đơn hàng' : 'Order Summary',
    total: language === 'vi' ? 'Tổng cộng' : 'Total',
    pay: language === 'vi' ? 'Thanh toán' : 'Pay Now',
    processing: language === 'vi' ? 'Đang xử lý...' : 'Processing...',
    back: language === 'vi' ? 'Quay lại' : 'Back',
    continue: language === 'vi' ? 'Tiếp tục' : 'Continue',
    secure: language === 'vi' ? 'Thanh toán được bảo mật bởi SSL 256-bit' : 'Payment secured by 256-bit SSL',
    success: language === 'vi' ? 'Thanh toán thành công!' : 'Payment Successful!',
    successDesc: language === 'vi' ? 'Credit đã được cộng vào tài khoản của bạn' : 'Credits have been added to your account',
    done: language === 'vi' ? 'Hoàn tất' : 'Done',
    scanQR: language === 'vi' ? 'Quét mã QR để thanh toán' : 'Scan QR code to pay',
    bankInfo: language === 'vi' ? 'Thông tin chuyển khoản' : 'Bank Transfer Info',
    bankName: language === 'vi' ? 'Ngân hàng' : 'Bank',
    accountNumber: language === 'vi' ? 'Số tài khoản' : 'Account Number',
    accountName: language === 'vi' ? 'Tên tài khoản' : 'Account Name',
    content: language === 'vi' ? 'Nội dung CK' : 'Transfer Content',
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
    // Reset state
    setStep('method');
    setCardNumber('');
    setCardName('');
    setExpiry('');
    setCvv('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== 'method' && step !== 'success' && (
              <button 
                onClick={() => setStep('method')}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{trans.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* Success Step */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{trans.success}</h3>
            <p className="text-zinc-500 mb-2">{trans.successDesc}</p>
            {credits && (
              <p className="text-2xl font-bold text-amber-500 mb-6">+{credits} credits</p>
            )}
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
              onClick={handleComplete}
            >
              {trans.done}
            </Button>
          </div>
        )}

        {/* Method Selection Step */}
        {step === 'method' && (
          <div className="p-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">{trans.selectMethod}</p>
            
            <div className="space-y-2 mb-4">
              {/* Credit Card */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">{trans.card}</span>
              </button>

              {/* MoMo */}
              <button
                onClick={() => setPaymentMethod('momo')}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === 'momo'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                  <Smartphone size={20} className="text-pink-600" />
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">{trans.momo}</span>
              </button>

              {/* ZaloPay */}
              <button
                onClick={() => setPaymentMethod('zalopay')}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === 'zalopay'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <Smartphone size={20} className="text-blue-500" />
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">{trans.zalopay}</span>
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <Building2 size={20} className="text-green-600" />
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">{trans.bank}</span>
              </button>
            </div>

            {/* Order Summary */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 mb-4">
              <p className="text-xs text-zinc-500 mb-2">{trans.orderSummary}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{description}</span>
                <span className="font-bold text-zinc-900 dark:text-white">${amount}</span>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
              onClick={() => setStep('details')}
            >
              {trans.continue}
            </Button>
          </div>
        )}

        {/* Payment Details Step */}
        {step === 'details' && (
          <div className="p-4">
            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    {trans.cardNumber}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    {trans.cardName}
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="NGUYEN VAN A"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {trans.expiry}
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {trans.cvv}
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      placeholder="123"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MoMo / ZaloPay QR */}
            {(paymentMethod === 'momo' || paymentMethod === 'zalopay') && (
              <div className="text-center py-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{trans.scanQR}</p>
                <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-zinc-200">
                  {/* Placeholder QR */}
                  <div className="w-full h-full bg-zinc-100 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1">
                      {Array(25).fill(0).map((_, i) => (
                        <div key={i} className={`w-6 h-6 ${Math.random() > 0.5 ? 'bg-zinc-900' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-lg font-bold text-zinc-900 dark:text-white">${amount}</p>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentMethod === 'bank' && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{trans.bankInfo}</p>
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">{trans.bankName}:</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">Vietcombank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">{trans.accountNumber}:</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">{trans.accountName}:</span>
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">REPIX AI JSC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">{trans.content}:</span>
                    <span className="text-sm font-medium text-amber-600">TOPUP_{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                    <span className="text-sm text-zinc-500">{trans.total}:</span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">${amount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Note */}
            <div className="flex items-center gap-2 mt-4 p-2 rounded-lg bg-green-50 dark:bg-green-500/10">
              <Lock size={14} className="text-green-600" />
              <span className="text-xs text-green-700 dark:text-green-400">{trans.secure}</span>
            </div>

            {/* Pay Button */}
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500"
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'card' && (!cardNumber || !cardName || !expiry || !cvv))}
              isLoading={isProcessing}
            >
              {isProcessing ? trans.processing : `${trans.pay} $${amount}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
