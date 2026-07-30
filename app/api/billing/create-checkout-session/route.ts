import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured, isKnownPriceId } from "@/lib/stripe";
import { getUserContext } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Billing isn't configured yet — set STRIPE_SECRET_KEY and the STRIPE_PRICE_ID_* vars." },
      { status: 501 }
    );
  }

  const { priceId } = await request.json();
  if (typeof priceId !== "string" || !isKnownPriceId(priceId)) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const ctx = await getUserContext();
  if (!ctx || !ctx.studio) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const stripe = getStripe();
  const origin = request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 3 },
    payment_method_collection: "always",
    customer_email: ctx.email ?? undefined,
    client_reference_id: ctx.studio.id,
    metadata: { studio_id: ctx.studio.id },
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/onboarding/billing?checkout=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe didn't return a checkout URL." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
