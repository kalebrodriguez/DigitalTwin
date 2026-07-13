# DigitalTwin
## Complete Product Specification

> This document serves as the single source of truth for Claude Code to build DigitalTwin.

---

# Table of Contents

1. Product Requirements Document (PRD)
2. Technical Requirements Document (TRD)
3. UI / UX Design System
4. User Flow
5. Backend & Database Schema
6. API Specification
7. AI Architecture
8. Security
9. MVP Roadmap
10. Implementation Plan

---

# 1. PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product Name

DigitalTwin

## Vision

DigitalTwin creates a real-time AI-powered digital representation of a dementia patient's daily routine, allowing caregivers to monitor wellness without constant phone calls or uncertainty.

Our goal is to extend independent living while reducing caregiver anxiety.

## Problem

Millions of caregivers ask the same questions every day:

- Did Mom take her medication?
- Did Dad eat lunch?
- Did Grandma remember today's appointment?

Current solutions only solve isolated problems.

- Medication apps only remind.
- Care coordination apps require manual updates.
- Senior monitoring systems only detect emergencies.

No platform continuously creates a live digital representation of daily wellness.

## Target Users

### Primary Customer

Adult children, age 40–65.

Needs:
- Peace of mind
- Medication adherence
- Remote monitoring
- Family coordination

### Secondary Customer

Professional caregivers: home health agencies, assisted living, memory care facilities.

### End User

Patient: early Alzheimer's, Mild Cognitive Impairment, early dementia. Minimal technical literacy.

## Core Value Proposition

Patient:

> "I get a friendly assistant helping me through my day."

Family:

> "I always know how Mom is doing."

## Success Metrics

**Patient:** medication adherence, task completion %, daily engagement, average conversations/day.

**Caregiver:** reduced check-in calls, notification response time, stress reduction, retention.

**Business:** monthly recurring revenue, activation, 7-day retention, 30-day retention, LTV, CAC, referral %.

## MVP Features

**Patient**
- AI conversations
- Medication reminders
- Daily routine
- Voice interaction
- Large buttons
- Confirmation

**Caregiver**
- Dashboard
- Push notifications
- Daily timeline
- Live task status
- Daily summary

**AI**
- Conversational reminders
- Follow-up prompts
- Missed task escalation
- Personalized routine

**Future Features**
- Fall detection
- Apple Health
- Hero smart dispenser
- Alexa
- Wearables
- Behavior prediction
- Longitudinal decline detection

---

# 2. TECHNICAL REQUIREMENTS DOCUMENT

## Stack

**Frontend:** React Native, Expo, TypeScript, NativeWind, React Query, React Navigation, Reanimated, React Hook Form, Zod.

**Backend:** Supabase (Postgres, Supabase Auth, Edge Functions, Realtime, Storage).

**AI:** OpenAI Responses API, Speech-to-Text, Text-to-Speech, conversation memory, prompt orchestration.

**Notifications:** Firebase Cloud Messaging, Expo Notifications, APNS.

**Analytics:** PostHog, Sentry.

**Deployment:** Vercel, Supabase Cloud, GitHub Actions.

## Architecture

Patient App → Supabase → AI Service → Notification Engine → Caregiver Dashboard

---

# 3. UI / UX DESIGN SYSTEM

## Design Philosophy

Zero cognitive load. Everything should feel calming. No clutter. No hidden actions. Large typography. One action per screen.

## Color Palette

| Role | Hex |
|---|---|
| Primary | #2563EB |
| Accent | #3B82F6 |
| Success | #22C55E |
| Warning | #F59E0B |
| Danger | #EF4444 |
| Background | #F8FAFC |
| Card | White |

## Typography

SF Pro Display Bold for headings.

| Style | Size |
|---|---|
| Heading | 32 |
| Title | 24 |
| Body | 18 |
| Button | 20 |

Never use text smaller than 18px.

## Spacing

8pt system: 8, 16, 24, 32, 48.

## Corner Radius

24px. Everything rounded.

## Buttons

Height 64px. Large touch targets. Filled. Minimal text.

## Icons

Lucide Icons. Rounded. Simple.

## Patient Mode

Large buttons. Voice first. Minimal reading. No scrolling. Maximum three actions/screen.

## Caregiver Mode

Modern dashboard. Cards. Timeline. Charts. Notifications. Multiple patients.

---

# 4. APP FLOW

**PATIENT:** Launch → Good Morning Screen → Today's Routine → Reminder → Voice Conversation → Confirmation → Task Completed → Dashboard Updated → Next Task → Daily Summary

**CAREGIVER:** Launch → Dashboard → Patient Card → Today's Timeline → Medication Status → Activity Feed → Notifications → Settings

**FIRST TIME SETUP:** Create account → Invite caregiver → Create patient → Add medications → Create routine → Enable notifications → Done

---

# 5. DATABASE SCHEMA

**users:** id, email, role, created_at

**patients:** id, name, birthday, diagnosis, timezone, avatar

**caregivers:** id, user_id, patient_id, relationship

**medications:** id, patient_id, name, dose, schedule, instructions

**tasks:** id, patient_id, title, category, scheduled_time, repeat_rule, voice_prompt

**task_completions:** id, task_id, completed, completed_at, confirmation_type, confidence

**conversations:** id, patient_id, role, message, timestamp

**notifications:** id, patient_id, caregiver_id, title, body, status, created_at

**daily_timeline:** id, patient_id, event_type, timestamp, metadata

**digital_twin_state:** id, patient_id, current_status, last_activity, adherence_score, risk_score, hydration_score, medication_score, daily_completion, updated_at

---

# 6. API DESIGN

**POST** /auth/login, /auth/signup

**GET** /patient, /patient/tasks, /patient/timeline, /patient/today

**POST** /task/complete, /task/skip, /task/create

**GET** /dashboard, /dashboard/summary

**POST** /ai/respond

**POST** /notification/send

---

# 7. AI ARCHITECTURE

## System Prompt

The AI should behave as: friendly, patient, encouraging. Never overwhelming. Speak slowly. One request at a time. Avoid long explanations. Confirm completion before moving on.

If patient appears confused: repeat, simplify, offer help, notify caregiver if needed.

## Memory

Remember: favorite foods, family names, medication preferences, conversation style, preferred reminders, pet names, morning routine.

## Future AI

Behavior anomaly detection, routine prediction, mood estimation, decline detection, risk prediction.

---

# 8. SECURITY

HIPAA-inspired architecture. Encrypted database. Encrypted storage. JWT authentication. Role-based permissions. Audit logs. Row Level Security. Signed URLs. HTTPS only. Secure tokens.

---

# 9. MVP ROADMAP

**Phase 1:** Authentication, Patients, Caregivers, Dashboard, Tasks, Notifications

**Phase 2:** Voice AI, Medication, Conversation, Timeline, Digital Twin

**Phase 3:** Realtime syncing, Push notifications, Analytics, Daily summaries

**Phase 4:** Smart devices, Wearables, HealthKit, Google Health, Emergency contacts

---

# 10. IMPLEMENTATION PLAN

**Sprint 1:** Authentication, Database, Navigation, Supabase, Basic UI

**Sprint 2:** Patient screens, Dashboard, Tasks, Timeline, Notifications

**Sprint 3:** OpenAI integration, Voice, Speech, Conversation, Routine engine

**Sprint 4:** Realtime, Push notifications, Digital Twin updates, Daily summary

**Sprint 5:** Testing, Bug fixes, Performance, Accessibility, HIPAA review

**Sprint 6:** App Store assets, Landing page, Beta testing, Launch

---

# NORTH STAR

Every interaction should answer one question for caregivers:

> **"Is my loved one okay?"**

Everything in DigitalTwin should exist to answer that question with confidence, empathy, and as little friction as possible.
