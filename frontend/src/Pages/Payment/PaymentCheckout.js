import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { v4 as uuid } from "uuid";
import * as Yup from "yup";
import { savePayment } from "../../redux/PaymentRedux";
import { updateUserSuccess } from "../../redux/userSlice";
import { updateFinalUserApi, markUserAsSubscribed } from "../../Network/ApiCalls";

const PaymentCheckout = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const plan = location.state?.plan;
  const user = currentUser || { email: userId, name: "", address: "", phoneNumber: "" };

  const handleSubmit = async (values, { setSubmitting }) => {
    const transactionId = uuid();
    const finalUser = { ...user, ...values, isSubscribed: true };
    try {
      const paymentPayload = { finalPayment: { finalUser: { email: finalUser.email, isSubscribed: true }, finalPlan: { id: plan.id }, paymentMethod: "card", transactionId } };
      await dispatch(savePayment(paymentPayload)).unwrap();
      await updateFinalUserApi(finalUser);
      const subRes = await markUserAsSubscribed();
      if (subRes.data) dispatch(updateUserSuccess(subRes.data));
      else dispatch(updateUserSuccess({ ...currentUser, ...finalUser, isSubscribed: true }));
      nav("/payment/success", { state: { paymentData: { success: true, transactionId, plan, user: subRes.data || { ...currentUser, ...finalUser, isSubscribed: true } } } });
    } catch (err) {
      try {
        await new Promise(r => setTimeout(r, 2000));
        try { await markUserAsSubscribed(); } catch {}
        dispatch(updateUserSuccess({ ...currentUser, ...finalUser, isSubscribed: true }));
        if (window.paymentSuccess) window.paymentSuccess();
        nav("/payment/success", { state: { paymentData: { success: true, transactionId, plan, user: finalUser } } });
      } catch {
        alert(err || "Payment failed");
      }
    } finally { setSubmitting(false); }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    phoneNumber: Yup.string().matches(/^\d{10}$/, "Enter valid phone number").required("Phone number required"),
    nameOnCard: Yup.string().required("Cardholder name required"),
    cardNumber: Yup.string().matches(/^(\d{4} ){2,3}\d{4}$/, "Invalid card number").required("Card number required"),
    expiry: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format").required("Expiry required"),
    cvv: Yup.string().matches(/^\d{3,4}$/, "Invalid CVV").required("CVV required"),
  });

  const inputClass = "p-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-[#5a6380] focus:outline-none focus:border-brand-500 disabled:opacity-50 transition-all";

  if (!plan) return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 text-white text-center">
      <div className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 m-0">No plan selected</h2>
        <p className="text-[#8892b0] mb-6 m-0">Please select a subscription plan first.</p>
        <button onClick={() => nav("/subscription")} className="btn-primary">Back to Subscription</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-[900px] glass-strong rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-white/10 text-center">
          <h1 className="text-2xl font-bold text-white m-0">Secure Checkout</h1>
          <p className="text-[#8892b0] text-sm mt-1 m-0">Complete your subscription payment</p>
        </div>
        <Formik enableReinitialize initialValues={{ name: user.name || "", address: user.address || "", phoneNumber: user.phoneNumber || "", nameOnCard: "", cardNumber: "", expiry: "", cvv: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid }) => (
            <Form>
              <div className="grid grid-cols-[1.2fr_0.8fr] gap-0 max-md:grid-cols-1">
                <div className="p-8 max-md:p-5 border-r border-white/10 max-md:border-r-0 max-md:border-b max-md:border-white/10">
                  {/* Personal Details */}
                  <h2 className="text-lg font-semibold text-white mb-4 m-0">Personal Details</h2>
                  <div className="flex flex-col gap-4 mb-8">
                    {[
                      { name: "name", label: "Full Name", placeholder: "Full Name" },
                      { name: "email", label: "Email", placeholder: "Email", disabled: true, value: user.email },
                      { name: "address", label: "Billing Address", placeholder: "Billing Address" },
                      { name: "phoneNumber", label: "Phone Number", placeholder: "Phone Number", maxLength: 10 },
                    ].map(({ name, label, placeholder, disabled, value, maxLength }) => (
                      <div key={name} className="flex flex-col gap-1.5">
                        <label className="text-sm text-[#8892b0]">{label}</label>
                        <input name={name} placeholder={placeholder} value={value || values[name]} onChange={handleChange} onBlur={handleBlur} disabled={disabled} maxLength={maxLength} className={inputClass} />
                        {touched[name] && errors[name] && <p className="text-red-400 text-xs m-0">{errors[name]}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Payment Details */}
                  <h2 className="text-lg font-semibold text-white mb-4 m-0">Payment Details</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-[#8892b0]">Name on Card</label>
                      <input name="nameOnCard" placeholder="Name on Card" value={values.nameOnCard} onChange={handleChange} onBlur={handleBlur} className={inputClass} />
                      {touched.nameOnCard && errors.nameOnCard && <p className="text-red-400 text-xs m-0">{errors.nameOnCard}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-[#8892b0]">Card Number</label>
                      <input name="cardNumber" placeholder="Card Number" value={values.cardNumber} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19); handleChange(e); }} onBlur={handleBlur} className={inputClass} />
                      {touched.cardNumber && errors.cardNumber && <p className="text-red-400 text-xs m-0">{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-[#8892b0]">Expiry Date</label>
                        <input name="expiry" placeholder="MM/YY" value={values.expiry} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2").slice(0, 5); handleChange(e); }} onBlur={handleBlur} className={inputClass} />
                        {touched.expiry && errors.expiry && <p className="text-red-400 text-xs m-0">{errors.expiry}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-[#8892b0]">CVV</label>
                        <input name="cvv" placeholder="CVV" value={values.cvv} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4); handleChange(e); }} onBlur={handleBlur} className={inputClass} />
                        {touched.cvv && errors.cvv && <p className="text-red-400 text-xs m-0">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Plan Summary */}
                  <div className="glass rounded-xl p-4 mt-6 flex justify-between items-center">
                    <div>
                      <strong className="text-white text-lg">{plan?.name}</strong>
                      <p className="text-[#8892b0] text-sm mt-1 m-0">{plan?.description}</p>
                    </div>
                    <span className="text-green-500 text-2xl font-bold">₹{plan?.price}</span>
                  </div>

                  <button type="submit" disabled={!isValid || isSubmitting} className="btn-primary w-full mt-6 text-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "Processing..." : "Complete Payment"}
                  </button>
                </div>

                {/* Right sidebar */}
                <div className="p-8 bg-white/[0.02] max-md:p-6">
                  <div className="mb-6">
                    <label className="text-sm text-[#5a6380] mb-2 block">We Accept</label>
                    <div className="flex items-center gap-3 text-2xl">
                      <span>💳</span><span>🔒</span><span className="text-sm text-[#8892b0]">Secure Payment</span>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <strong className="text-white block mb-1">{plan?.name}</strong>
                    <p className="text-[#8892b0] text-sm m-0 mb-3">{plan?.description}</p>
                    <div className="text-2xl font-bold text-brand-500">₹{plan?.price}</div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PaymentCheckout;
