# syntax=docker/dockerfile:1
FROM node:18.1-alpine3.15
VOLUME ["/app"]
WORKDIR /app
COPY . .
RUN npm install
RUN cd client && npm install
RUN cd server && npm install
EXPOSE 3000
EXPOSE 3001
RUN npm i -g nodemon
CMD (npm run start-client&) && npm run start-server
