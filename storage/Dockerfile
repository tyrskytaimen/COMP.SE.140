FROM python:3.13-slim

WORKDIR /app

RUN pip install flask

COPY main.py .

EXPOSE 5001

CMD [ "python", "main.py" ]