FROM node:20-alpine
WORKDIR /frontend

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

CMD ["yarn", "start", "--host", "--port", "$PORT"]

EXPOSE ${PORT}
