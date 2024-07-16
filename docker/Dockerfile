FROM node:20
WORKDIR /frontend
ENV PORT=3001
CMD ["sh","-c","yarn && yarn build && yarn start --host --port $PORT"]

EXPOSE ${PORT}