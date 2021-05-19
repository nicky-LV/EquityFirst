# syntax=docker/dockerfile:1
FROM python:alpine
ENV PYTHONUNBUFFERED=1
WORKDIR /docker-equityalpha
COPY . .
RUN pip install -r requirements.txt && pip list
