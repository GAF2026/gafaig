// lib/applicant/repository.ts
//
// Repository Maturation Layer
// Shared Applicant Repository Facade
//
// This file preserves the existing import path:
//
//   "@/lib/applicant/repository"
//
// Applicant API routes may continue importing shared helpers from this file.
// Implementation is split into focused modules to reduce duplication without
// changing public API contracts or governance authority.

export * from "./constants";
export * from "./helpers";
export * from "./counts";
export * from "./scope";