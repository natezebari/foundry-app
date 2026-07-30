import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Logo } from "@/components/Logo";
import { StartTrialButton } from "@/components/StartTrialButton";
import { getUserContext } from "@/lib/auth";
import { getPlanPriceIds, getStripe, isStripeConfigured, PLAN_LABELS, type PlanKey } from "@/lib/stripe";

interface PlanCard {
  key: PlanKey;
  priceId: string;
  label: string;
  amount: string;
  interval: string;
}

async function getPlanCards(): Promise<PlanCard[]> {
  const priceIds = getPlanPriceIds();
  const stripe = getStripe();

  const entries = await Promise.all(
    (Object.entries(priceIds) as [PlanKey, string][]).map(async ([key, priceId]) => {
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount != null ? (price.unit_amount / 100).toFixed(2) : "—";
      return {
        key,
        priceId,
        label: PLAN_LABELS[key],
        amount: `$${amount}`,
        interval: price.recurring?.interval ?? "month",
      };
    })
  );

  // Stable order regardless of env var declaration order.
  const order: PlanKey[] = ["pro", "studio", "enterprise"];
  return entries.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
}

export default async function BillingOnboardingPage() {
  const ctx = await getUserContext();
  if (!ctx) redirect("/login");
  if (!ctx.profile?.roblox_user_id) redirect("/onboarding/connect-roblox");
  if (ctx.studio && ["trialing", "active"].includes(ctx.studio.subscription_status)) {
    redirect("/dashboard");
  }

  const stripeReady = isStripeConfigured();
  const plans = stripeReady ? await getPlanCards() : [];

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-3xl space-y-4">
        <div className="text-center space-y-1">
          <CreditCard size={28} className="text-muted mx-auto" />
          <h1 className="font-display font-semibold text-base text-text">Start your free trial</h1>
          <p className="text-xs text-muted">
            3 days free, then billed monthly. We need a card on file to start the trial — cancel
            anytime before it ends and you won&apos;t be charged.
          </p>
        </div>

        {!stripeReady ? (
          <p className="text-xs text-danger text-center">
            Billing isn&apos;t configured yet. Ask the studio owner to add STRIPE_SECRET_KEY,
            STRIPE_WEBHOOK_SECRET, and the STRIPE_PRICE_ID_* vars.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.key} className="rounded-lg border border-border bg-surface p-5 text-center space-y-3">
                <h2 className="font-display font-semibold text-sm text-text">{plan.label}</h2>
                <p className="text-2xl font-display font-bold text-text">
                  {plan.amount}
                  <span className="text-xs text-muted font-mono">/{plan.interval}</span>
                </p>
                <StartTrialButton priceId={plan.priceId} planLabel={plan.label} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
