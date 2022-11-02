FROM node:16-alpine

WORKDIR /opt/fleet
COPY ./package*.json ./
RUN npm install

COPY ./build ./build

ENTRYPOINT [ "node", "./build/api/main.js" ]