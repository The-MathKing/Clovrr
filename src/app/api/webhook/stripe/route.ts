import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-06-24.dahlia', // Update to latest Stripe API version if necessary
});

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  );

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // 1. Get the customer's email and details
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'New Client';
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (customerEmail) {
      console.log(`New client joined: ${customerEmail}`);

      // 2. Insert or update the client in Supabase
      const { error } = await supabase.from('clients').upsert({
        email: customerEmail,
        name: customerName,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        // The Twilio number and Calendly link will be set manually later
      }, { onConflict: 'email' });

      if (error) {
        console.error('Failed to create client in Supabase:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
      }

      // 3. (Optional) Trigger an onboarding email here using Resend or SendGrid
      // await sendOnboardingEmail(customerEmail);
    }
  }

  return NextResponse.json({ received: true });
}
