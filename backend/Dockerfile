FROM python:3.11-slim

WORKDIR /srv

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ai/ ./ai/
COPY backend/ ./backend/
COPY data/ ./data/

WORKDIR /srv/backend
ENV PYTHONPATH=/srv

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
