# LodgeIQ

Professional hotel and resort inspection platform for tour operators, travel agencies, and hospitality inspectors.

**Live Demo:** [https://lodge-iq.vercel.app/](https://lodge-iq.vercel.app/)

![LodgeIQ Platform](https://img.shields.io/badge/Status-Live-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

LodgeIQ is a comprehensive inspection management system designed to help tour operators and travel agencies systematically evaluate and document lodging facilities. The platform streamlines quality assurance processes, reduces client complaints, and maintains detailed records of property inspections.

## Purpose

Tour operators and travel agencies need reliable methods to assess accommodation quality before sending clients. LodgeIQ provides a standardized approach to property inspections, ensuring consistent evaluation criteria and transparent communication between operators, hotels, and clients.

## Target Users

**Tour Operators** - Companies managing accommodations for tours and travel packages, particularly safari operators and destination specialists.

**Travel Agencies** - Agencies coordinating lodging for multiple clients across various properties.

**Hospitality Inspectors** - Independent consultants and quality assurance professionals evaluating accommodation standards.

**Hotel Management** - Properties conducting self-assessments and pre-audit quality checks.

## Core Features

**Digital Inspection Checklists** - Customizable evaluation criteria covering rooms, amenities, cleanliness, safety protocols, and service quality. Items can be marked as Pass, Fail, or Needs Improvement with contextual notes.

**Visual Documentation** - Integrated photo capture linking images directly to specific checklist items and inspection sections, providing visual evidence of property conditions.

**Rating and Scoring** - Section-specific ratings for cleanliness, service, and facilities, with composite scoring for overall property evaluation.

**Property Database** - Centralized repository of inspected properties including complete inspection history, contact information, location data, and operational notes.

**Advanced Search & Filtering** - Real-time search functionality across hotels and inspections with intelligent filtering options. Search hotels by name, city, country, or address with instant results. Filter inspections by property, inspector, status, and date range.

**Report Generation** - Professional inspection reports with export capabilities (CSV and PDF) for management review and client communication. Comprehensive analytics with filterable views and downloadable reports.

**Team Collaboration** - Role-based access for inspectors, managers, and optional hotel representatives with shared visibility and communication tools.

**Analytics Dashboard** - Comprehensive metrics tracking inspection trends, property performance, rating distributions, and inspector activity across your portfolio. Interactive charts with drill-down capabilities and performance indicators.

## Technology Stack

**Frontend** - Next.js 14 with App Router, React 18, TypeScript, and Tailwind CSS for responsive, modern interface design.

**Backend** - Next.js API Routes providing RESTful endpoints for data operations.

**Database** - PostgreSQL hosted on Neon with Prisma ORM for type-safe database operations.

**Authentication** - NextAuth.js supporting email magic links and OAuth providers.

**Charts and Visualization** - Recharts library for interactive data visualization and reporting.

**Deployment** - Optimized for Vercel platform with edge runtime capabilities.

## Business Model

LodgeIQ operates as a B2B SaaS platform with subscription-based pricing. Monthly and annual plans are available for tour operators and travel agencies. Premium tiers offer advanced reporting, multi-team access, and comprehensive analytics dashboards. Optional add-ons include integration with booking systems and client-facing reporting portals.

## Value Proposition

LodgeIQ transforms ad-hoc hotel inspections into a systematic quality assurance process. By standardizing evaluation criteria and centralizing inspection data, operators can make informed decisions about property partnerships, identify trends across their accommodation portfolio, and provide clients with confidence in their travel experiences.

The platform reduces operational overhead by eliminating manual paperwork, improves accountability through visual documentation, and enables data-driven decision-making through comprehensive analytics.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/LodgeIQ.git
cd LodgeIQ
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and configuration.

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Seed the database with sample data

```bash
npx prisma db seed
```

6. Start the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.
