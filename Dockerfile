# syntax=docker/dockerfile:1
FROM python:3.8
COPY . /backend
RUN cd backend && pip install -r requirements.txt
