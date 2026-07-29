# Dockerfile for Hugging Face Spaces & Render / Railway Python FastAPI
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if required by numpy/pandas/psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY . .

# Hugging Face Spaces routes external traffic to port 7860 by default
ENV PORT=7860
EXPOSE 7860

# Run Uvicorn server on 0.0.0.0:7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
