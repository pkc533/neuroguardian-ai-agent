# Base Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend source code
COPY backend /app/backend

# Install dependencies
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    google-cloud-aiplatform \
    google-cloud-vision \
    vertexai \
    python-multipart

# Cloud Run expects port 8080
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start FastAPI
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]