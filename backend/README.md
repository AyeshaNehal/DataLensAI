---
title: DataLensAI API Server
emoji: 🧠
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
---

# DataLensAI FastAPI Backend Server

An AI-powered data analytics & exploratory data analysis platform backend built with FastAPI, Pandas, NumPy, and Groq LLM.

## Endpoints
- `POST /api/v1/auth/register` - User Registration
- `POST /api/v1/auth/login` - OAuth2 JWT Authentication
- `POST /api/v1/datasets/upload` - CSV Tabular Data Profiling & Ingestion
- `GET /api/v1/eda/{id}/summary` - Descriptive Statistical Profiler
- `GET /api/v1/eda/{id}/distribution` - NumPy Histogram & Frequency Calculator
- `GET /api/v1/eda/{id}/correlation` - Pairwise Pearson Correlation Engine
- `GET /api/v1/ai/{id}/insights` - Automated Executive AI Reports
- `POST /api/v1/ai/query` - Natural Language Dataset Queries & Code Gen
