FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN mkdir -p /app/data

COPY . .

EXPOSE 5000

CMD ["npm", "start"]