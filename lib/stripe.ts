import Stripe from "stripe";
import { loadStripe, Stripe as StripeJS } from "@stripe/stripe-js";

/**
 * Stripe client côté serveur
 * Utilisé dans les API routes et Server Components
 */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Missing Stripe secret key. Please set STRIPE_SECRET_KEY in .env.local"
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

/**
 * Stripe client côté navigateur (lazy loading)
 * Utilisé dans les composants React côté client
 */
let stripePromise: Promise<StripeJS | null>;

export const getStripe = (): Promise<StripeJS | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error(
        "Missing Stripe publishable key. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local"
      );
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};
