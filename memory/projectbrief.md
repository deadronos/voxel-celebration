# Project Brief — Voxel New Years Celebration

**Repository:** `voxel-new-years-celebration` (owner: `deadronos`)
**Created:** 2025-12-27

## Purpose

An interactive, holiday-themed 3D demo that showcases a voxel-style village, fireworks, and sky lanterns using React + Three.js. The project is designed as a lightweight, visually rich demo for learning, sharing, and showcasing Three.js and React Three Fiber techniques.

## Primary Goals

- Deliver an engaging, performant 3D scene with modular components (houses, environment, fireworks, sky lanterns).
- Make the app easy to run locally and to iterate on: `npm install` → `npm run dev`.
- Maintain high code quality: TypeScript types, linting, formatting, and automated tests (Vitest).
- Keep the rendering pipeline and particles performant and testable.

## Acceptance Criteria

- The app builds and runs locally using the documented commands in `README.md`.
- Key components (`House`, `FireworksManager`, `SkyLantern`, `Environment`) expose simple, documented props and are covered by unit tests.
- Visual features (fireworks, lanterns, lighting) behave deterministically enough to allow snapshot or logic tests for critical behavior.
- Codebase follows existing linting/formatting rules and has basic CI checks (lint, test) passing locally.

## Non-Goals / Constraints

- This project is a visual/interactive demo and is not intended to be a full-featured physics simulator.
- Mobile support is secondary—priority is maintainability and desktop performance.

## Primary Contacts and Links

- Owner: `deadronos` (repo)
- Run locally: see `README.md`
- Tech stack: React, React Three Fiber, Three.js, Vite, TypeScript, Vitest, ESLint, Prettier

---

_This document is the canonical short-form project brief for maintainers and contributors._
