FROM node:12.18

WORKDIR /usr/src/app

COPY . .
COPY ./config /root/.aws

RUN yarn install

EXPOSE 3001
EXPOSE 4001

ENTRYPOINT ["./internals/entrypoint.sh"]
