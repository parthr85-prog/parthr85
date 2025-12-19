const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

/**
 * Create Razorpay order
 */
exports.createRazorpayOrder = functions.https.onCall(
  async ({ planId }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Not authenticated"
      );
    }

    const plans = {
      basic: { amount: 99900, days: 30 },
      pro: { amount: 249900, days: 90 },
    };

    const plan = plans[planId];
    if (!plan) {
      throw new functions.https.HttpsError("invalid-argument", "Invalid plan");
    }

    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  }
);

/**
 * Verify payment & activate subscription
 */
exports.verifyPayment = functions.https.onCall(
  async ({ paymentId, orderId, signature, planId }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Not authenticated"
      );
    }

    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", functions.config().razorpay.key_secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Payment verification failed"
      );
    }

    const uid = context.auth.uid;
    const now = admin.firestore.Timestamp.now();

    const planDays = planId === "pro" ? 90 : 30;
    const expiresAt = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + planDays * 24 * 60 * 60 * 1000)
    );

    await admin.firestore().doc(`users/${uid}`).update({
      subscription: {
        planId,
        startsAt: now,
        expiresAt,
      },
    });

    return { success: true };
  }
);
