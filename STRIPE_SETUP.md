# Stripe Payment Architecture Setup Guide

For Clovrr Solutions high-ticket B2B sales, we avoid standard self-serve pricing tables. Instead, we use **Stripe Payment Links** connected to **Stripe Billing** to handle the Setup Fee + Retainer structure smoothly over a sales call.

## Step 1: Create the Product
1. Log in to your Stripe Dashboard.
2. Navigate to **Products** > **Add Product**.
3. Name the product: `Clovrr AI Concierge`.
4. Add a description if desired (e.g., "Full-service AI Lead Concierge setup and monthly retainer").

## Step 2: Add Price Points
Under the product you just created, you need to add **two** separate prices.

### Price 1 (Setup Fee)
- **Pricing Model:** Standard pricing
- **Price:** `$1,500.00`
- **Billing Period:** One-time
- *Save this price.*

### Price 2 (Monthly Retainer)
- Click **Add another price** on the same product.
- **Pricing Model:** Standard pricing
- **Price:** `$1,000.00`
- **Billing Period:** Recurring (Monthly)
- *Save this price.*

## Step 3: Create the Checkout Flow
1. Go to **Payments** > **Payment Links** in Stripe.
2. Click **New Payment Link**.
3. In the product dropdown, select **Clovrr AI Concierge**.
4. Check the boxes/select **both** the $1,500 one-time fee and the $1,000 recurring fee. 
5. The checkout preview should show a total of **$2,500 due today**, and `$1,000/month` starting on day 30.
6. (Optional) Customize the confirmation page to redirect to a Calendly onboarding link or a welcome Loom video.
7. Click **Create Link**.

## Step 4: The Sales Process
When you close a client on Zoom or Google Meet:
1. Copy the generated Stripe Payment Link.
2. Drop it directly in the chat while on the call.
3. Have them complete the checkout while you answer any final questions.
4. Stripe will handle the initial $2,500 charge and automatically enroll them in the $1,000/mo subscription.

---
> **Security Reminder:** The `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in your `.env.local` must remain fully secure. Never prefix them with `NEXT_PUBLIC_`.
