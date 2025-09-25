FROM node:24-slim

WORKDIR /app

COPY package*.json .

RUN npm install

COPY main.js .

CMD [ "npm", "start" ]