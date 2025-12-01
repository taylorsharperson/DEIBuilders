DEI Builders Career Platform — README
## 📌 Overview'

DEI Builders is a career development platform designed to help students upload resumes, analyze their skills, and receive tailored insights for professional growth. The system focuses on accessibility, ease of use, and supporting diverse users as they prepare for internships, jobs, and opportunities.

This project is developed by Bryce Anderson, Taylor Sharperson, and Madison McNealy.

## 🎯 Project Purpose'

The career website will allow students to:

Upload their resumes (PDF or DOCX)

Have their resumes analyzed for skills and experience

View insights on a dashboard

Store files securely

Access a clean, intuitive interface built with Bootstrap 5.3 and FontAwesome

This initial release focuses on delivering a vertical slice that completes the resume upload process end‑to‑end.

## Architecture & Data'

Initial architecture diagram in /docs/ARCHITECTURE.md

Early data model for user and resume entries

## 📁 Repository Structure'
root/
 ├── docs/
 │    ├── README.md
 │    ├── ARCHITECTURE.md
 │    └── MANUAL.md (skeleton)
 ├── src/
 ├── tests/
 ├── .github/workflows/
 │    └── ci.yml (GitHub Actions CI)
 ├── env.example
 └── README.md
## 🛠️ Tooling & Standards'
## Version Control'

GitHub repository

main is protected

All work must be done on feature branches

Squash merges only

PR requires at least one reviewer

## Project Board'

Kanban columns:

Backlog

Selected for Sprint

In Progress

In Review / QA

Done

Every PBI links to SAR requirements.

## CI Pipeline (GitHub Actions)'

Automatically builds code on every PR

Runs unit tests

Enforces linter + formatting rules

Badge Template (update paths):

[![Super-Linter](https://github.com/OWNER/REPO/actions/workflows/linter.yml/badge.svg)](https://github.com/marketplace/actions/super-linter)
## Quality Gates'

Unit test coverage: ≥ 50%

No high‑severity linter errors

Documentation updated for all changes

## ✅ Definitions'
## Definition of Ready (DoR)'

A story is ready if it includes:

Clear user story format

Testable acceptance criteria

Story points

SAR linkage

Identified dependencies

## Definition of Done (DoD)'

A story is done only if:

Code merged to main with passing CI

Tests implemented and passing

Documentation updated

PO manually accepts the story

AI usage logged

## 🔧 Environment Setup'
## Requirements'

Node.js / Python / TBD (your team will finalize)

No secrets included in the repo

## Setup Instructions'
cp env.example .env
npm install   # or project equivalent
npm run dev

## 👥 Contributors'

Bryce Anderson

Taylor Sharperson

Madison McNealy
