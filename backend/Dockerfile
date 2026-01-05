# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
RUN pip install fastapi uvicorn

COPY . .

# Expose port 8000
EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]