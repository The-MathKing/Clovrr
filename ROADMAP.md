# Clovrr AI Concierge - Development Roadmap

This document tracks the progress, completed phases, and upcoming features for the Clovrr AI Concierge platform.

## ✅ Completed Phases

### Phase 1: Foundation & Core Architecture
- [x] Next.js 14 App Router Setup with TailwindCSS
- [x] Supabase integration (Database & Auth)
- [x] Basic Client Dashboard Layout (Sidebar, TopNav)
- [x] Landing Page scaffolding

### Phase 2: Database Schema
- [x] `public.clients` table (Stores agency info, Stripe IDs, Twilio numbers)
- [x] `public.leads` table (Stores inbound prospects, status, contact info)
- [x] `public.conversations` table (Stores AI/Prospect message history)
- [x] RLS (Row Level Security) policies enforced

### Phase 3: Twilio & AI Engine Backend
- [x] Twilio Webhook route (`/api/webhook/twilio`)
- [x] OpenAI Integration for Concierge responses
- [x] Automated state machine (new -> qualified/booked)
- [x] Calendly booking link injection

### Phase 4: Auth & Access Control
- [x] Magic Link / Google OAuth integration
- [x] Dashboard route protection (Middleware)
- [x] Fixed hidden trailing whitespace email bugs
- [x] Logout functionality added to sidebar

### Phase 5: Insurance Prompt & Performance Billing
- [x] Insurance-specific AI system prompt tailored for B2B independent agencies
- [x] Strict compliance filtering (`[STATUS: OPT_OUT]`)
- [x] Dashboard Billing Tracker UI (calculating usage at $30/qualified lead)

### Phase 6: Linear UI Overhaul & Integrations Hub
- [x] Total aesthetic overhaul to Linear.app standards (deep blacks, glowing borders)
- [x] Glassmorphism modals and tight typography
- [x] Functional "Omnichannel Integrations" Hub in Settings
- [x] Database migration to support API keys (Twilio SID, SendGrid API Key)

### Phase 7: Interactive Lead Conversation Viewer
- [x] Leads Manager table converted to interactive Client Component
- [x] Slide-out glassmorphic side-panel for Conversation History
- [x] iMessage-style chat bubbles for AI (green) vs Prospect (gray)

---

## 🏗️ In Progress / Upcoming Phases

### Phase 8: Email & Instagram Omnichannel Routing
- [ ] Connect SendGrid API for Email lead ingestion and AI response
- [ ] Implement Meta/Instagram API for DM qualification (Pending Meta App Approval)
- [ ] Centralize AI prompt logic to handle multiple channels dynamically

### Phase 9: Stripe Billing Integration
- [ ] Stripe Webhook (`/api/webhook/stripe`)
- [ ] Auto-generate invoices for Usage-Based Billing ($30/qualified lead)
- [ ] Subscription setup ($250 upfront configuration fee)

### Phase 10: Client Management Admin Panel
- [ ] Super-admin view to manage active clients
- [ ] Enforce `is_active` flag to lock out unpaid/inactive users
- [ ] Analytics dashboard across all agencies

---
*Maintained by the Clovrr Development Team.*
