# FROM node:14.15.3-alpine
FROM node:14.15.3

WORKDIR /usr/src/app/

COPY package*.json ./

RUN rm -rf /var/lib/apt/lists/*
RUN apt-get clean
RUN apt-get update
# RUN apt-get install chromium-browser
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb

RUN npm install

COPY . .