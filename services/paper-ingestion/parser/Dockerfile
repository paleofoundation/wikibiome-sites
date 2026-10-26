FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends clamav poppler-utils tesseract-ocr && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir pypdf==6.10.0
WORKDIR /app
COPY server.py /app/server.py
RUN mkdir -p /var/lib/clamav && chown -R clamav:clamav /var/lib/clamav /app
USER clamav
EXPOSE 8080
CMD ["python", "/app/server.py"]
