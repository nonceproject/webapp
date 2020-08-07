FROM node:12.18

WORKDIR /usr/src/app

COPY . .
COPY ./config /root/.aws

RUN yarn install

ENTRYPOINT ["./internals/entrypoint.sh"]

EXPOSE 3001
EXPOSE 4001
EXPOSE 5001
