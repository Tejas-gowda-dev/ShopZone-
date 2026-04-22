import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CreditCard, Ship, CheckCircle2, ChevronRight, ArrowLeft, Loader2, ShieldCheck, MapPin, Phone, Mail, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { useNavigate, Navigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import { cn } from '../../lib/utils';

// Validation Schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Invalid ZIP code'),
  country: z.string().min(2, 'Country is required'),
  saveAddress: z.boolean(),
  cardNumber: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Invalid card format'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cvv: z.string().length(3, 'Must be 3 digits'),
  cardholderName: z.string().min(3, 'Cardholder name is required'),
  paymentMethod: z.enum(['credit_card', 'paypal']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [step, setStep] = React.useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      paymentMethod: 'credit_card',
      saveAddress: false,
    },
  });

  const paymentMethod = watch('paymentMethod');
  const cartTotal = getCartTotal();
  const shipping = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (items.length === 0 && !isPlacingOrder) {
    return <Navigate to="/cart" replace />;
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'addressLine1', 'city', 'state', 'zipCode', 'country'];
    } else if (step === 2) {
      if (paymentMethod === 'credit_card') {
        fieldsToValidate = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => prev + 1);
    else showToast('Please fix the errors in the form', 'error');
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsPlacingOrder(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Success
    showToast('Order placed successfully!', 'success');
    navigate('/order-success', { state: { customerName: data.firstName, orderTotal: total } });
  };

  const steps = [
    { id: 1, label: 'Shipping', icon: Ship },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Review', icon: ShoppingBag },
  ];

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center group">
                <div
                  className={cn(
                    'h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 border-2',
                    step >= s.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'border-slate-200 bg-white text-slate-400'
                  )}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-black uppercase tracking-widest',
                    step >= s.id ? 'text-blue-600' : 'text-slate-400'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-slate-100 mx-4 -mt-6">
                  <div
                    className="h-full bg-blue-600 transition-all duration-700"
                    style={{ width: step > s.id ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as CheckoutFormData))} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border dark:border-slate-800 shadow-sm border-slate-200/60">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-blue-600" />
                      Shipping Address
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">First Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input {...register('firstName')} className={cn("w-full h-12 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.firstName && "ring-2 ring-red-500")} placeholder="John" />
                        </div>
                        {errors.firstName && <p className="text-xs text-red-500 font-medium">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Last Name</label>
                        <input {...register('lastName')} className={cn("w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.lastName && "ring-2 ring-red-500")} placeholder="Doe" />
                        {errors.lastName && <p className="text-xs text-red-500 font-medium">{errors.lastName.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input {...register('email')} className={cn("w-full h-12 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.email && "ring-2 ring-red-500")} placeholder="john@example.com" />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input {...register('phone')} className={cn("w-full h-12 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.phone && "ring-2 ring-red-500")} placeholder="+1 (555) 000-0000" />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Address Line 1</label>
                        <input {...register('addressLine1')} className={cn("w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.addressLine1 && "ring-2 ring-red-500")} placeholder="123 Street Ave" />
                        {errors.addressLine1 && <p className="text-xs text-red-500 font-medium">{errors.addressLine1.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">City</label>
                        <input {...register('city')} className={cn("w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.city && "ring-2 ring-red-500")} placeholder="New York" />
                        {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">State / ZIP</label>
                        <div className="flex gap-2">
                           <input {...register('state')} className={cn("w-1/2 h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.state && "ring-2 ring-red-500")} placeholder="NY" />
                           <input {...register('zipCode')} className={cn("w-1/2 h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.zipCode && "ring-2 ring-red-500")} placeholder="10001" />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Country</label>
                        <select {...register('country')} className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <Button type="button" onClick={nextStep} className="w-full h-14 text-lg">
                    Continue to Payment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border dark:border-slate-800 shadow-sm">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      Payment Method
                    </h2>

                    <div className="flex gap-4 mb-8">
                       <button
                         type="button"
                         onClick={() => setValue('paymentMethod', 'credit_card')}
                         className={cn(
                           "flex-1 h-14 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all",
                           paymentMethod === 'credit_card' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 hover:border-slate-300"
                         )}
                       >
                         <CreditCard className="h-5 w-5" />
                         Card
                       </button>
                       <button
                         type="button"
                         onClick={() => setValue('paymentMethod', 'paypal')}
                         className={cn(
                           "flex-1 h-14 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all",
                           paymentMethod === 'paypal' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 hover:border-slate-300"
                         )}
                       >
                         <span className="text-blue-900 font-black italic">Pay</span><span className="text-blue-500 font-black italic">Pal</span>
                       </button>
                    </div>

                    {paymentMethod === 'credit_card' ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 uppercase">Card Number</label>
                          <input
                            {...register('cardNumber')}
                            onChange={(e) => {
                               const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                               const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                               setValue('cardNumber', formatted);
                            }}
                            placeholder="0000 0000 0000 0000"
                            className={cn("w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.cardNumber && "ring-2 ring-red-500")}
                          />
                          {errors.cardNumber && <p className="text-xs text-red-500 font-medium">{errors.cardNumber.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Expiry Date</label>
                            <input
                              {...register('expiryDate')}
                              onChange={(e) => {
                                 let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                 if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                                 setValue('expiryDate', val);
                              }}
                              placeholder="MM/YY"
                              className={cn("w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.expiryDate && "ring-2 ring-red-500")}
                            />
                            {errors.expiryDate && <p className="text-xs text-red-500 font-medium">{errors.expiryDate.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">CVV</label>
                            <input
                              {...register('cvv')}
                              type="password"
                              maxLength={3}
                              placeholder="***"
                              className={cn("w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.cvv && "ring-2 ring-red-500")}
                            />
                            {errors.cvv && <p className="text-xs text-red-500 font-medium">{errors.cvv.message}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Cardholder Name</label>
                          <input {...register('cardholderName')} placeholder="JOHN DOE" className={cn("w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500", errors.cardholderName && "ring-2 ring-red-500")} />
                          {errors.cardholderName && <p className="text-xs text-red-500 font-medium">{errors.cardholderName.message}</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl">
                         <div className="p-4 bg-blue-50 rounded-full">
                           <ShieldCheck className="h-10 w-10 text-blue-600" />
                         </div>
                         <p className="font-bold text-slate-700">You will be redirected to PayPal to complete your purchase securely.</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-14">
                       <ArrowLeft className="mr-2 h-5 w-5" />
                       Back
                    </Button>
                    <Button type="button" onClick={nextStep} className="flex-2 h-14">
                      Review Order
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border dark:border-slate-800 shadow-sm space-y-8">
                     <div>
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                          <ShoppingBag className="h-6 w-6 text-blue-600" />
                          Order Review
                        </h2>
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                               <div className="h-14 w-14 rounded-lg bg-slate-50 p-2 flex-shrink-0">
                                 <img src={item.image} className="h-full w-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                               </div>
                               <div className="flex-1 min-w-0">
                                 <p className="font-bold text-sm truncate">{item.title}</p>
                                 <p className="text-xs text-slate-500">{item.quantity} x {formatPrice(item.price)}</p>
                               </div>
                               <p className="font-black">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Shipping To</h4>
                           <p className="font-bold">{watch('firstName')} {watch('lastName')}</p>
                           <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                             {watch('addressLine1')}, {watch('city')}<br />
                             {watch('state')} {watch('zipCode')}, {watch('country')}
                           </p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Payment Method</h4>
                           {paymentMethod === 'credit_card' ? (
                             <div className="flex items-center gap-3">
                               <CreditCard className="h-5 w-5 text-blue-600" />
                               <div>
                                 <p className="font-bold">Card ending in {watch('cardNumber').slice(-4)}</p>
                                 <p className="text-xs text-slate-500">Expires {watch('expiryDate')}</p>
                               </div>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2 font-bold text-blue-600 italic">
                               <CheckCircle2 className="h-5 w-5" />
                               PayPal
                             </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-14" disabled={isPlacingOrder}>
                       <ArrowLeft className="mr-2 h-5 w-5" />
                       Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-2 h-14 text-lg"
                      isLoading={isPlacingOrder}
                    >
                      {isPlacingOrder ? 'Processing...' : `Place Order (
                        ${formatPrice(total)})`}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Sidebar Summary */}
        <aside className="sticky top-24 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black mb-6">In Your Bag</h3>
            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Subtotal</span>
                 <span className="font-bold">{formatPrice(cartTotal)}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Shipping</span>
                 <span className="font-bold text-emerald-600">
                   {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                 </span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500 font-medium">Tax</span>
                 <span className="font-bold">{formatPrice(tax)}</span>
               </div>
               <div className="pt-4 border-t border-dashed dark:border-slate-800">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
               </div>
            </div>
            
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium uppercase tracking-widest leading-relaxed">
                Your payment is secure and protected by industry-standard encryption.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
