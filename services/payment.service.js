import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/firebaseConfig";

export const createOrderService = async (planId) => {
  const fn = httpsCallable(functions, "createRazorpayOrder");
  const res = await fn({ planId });
  return res.data;
};

export const verifyPaymentService = async (data) => {
  const fn = httpsCallable(functions, "verifyPayment");
  const res = await fn(data);
  return res.data;
};
