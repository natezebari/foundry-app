import Stripe from "stripe";

export type PlanKey = "pro" | "studio" | "enterprise";

export const PLAN_LABELS: Record<PlanKey, string> = {
  pro: "Pro",
  studio: "Studio",
  enterprise: "Enterprise",
};

function planPriceEnvVar(plan: PlanKey) {
  return `STRIPE_PRICE_ID_${plan.toUpperCase()}`;
}

export function getPlanPriceIds(): Partial<Record<PlanKey, string>> {
  const ids: Partial<Record<PlanKey, string>> = {};
  (Object.keys(PLAN_LABELS) as PlanKey[]).forEach((plan) => {
    const id = process.env[planPriceEnvVar(plan)];
    if (id) ids[plan] = id;
  });
  return ids;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY) && Object.keys(getPlanPriceIds()).length > 0;
}

// True only if a given priceId is one of our known, configured plan prices —
// used to validate client-supplied priceId before creating a checkout session.
export function isKnownPriceId(priceId: string) {
  return Object.values(getPlanPriceIds()).includes(priceId);
}

let stripeSingleton: Stripe | null = null;

// Throws if STRIPE_SECRET_KEY isn't set yet — callers should check
// isStripeConfigured() first and return a friendly response instead.
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY isn't set — billing isn't configured yet.");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeSingleton;
}
