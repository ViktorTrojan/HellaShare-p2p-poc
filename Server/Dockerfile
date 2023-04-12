FROM node:14-alpine3.13

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY ./src ./src

CMD ["node", "src/Main.js"]