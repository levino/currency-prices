FROM node:7-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn
COPY . /usr/src/app
RUN yarn build
RUN rm -rf /usr/src/app/lib
RUN rm -rf /usr/src/app/node_modules && yarn --production && yarn cache clean

ENV NODE_ENV production
EXPOSE 3000

CMD [ "npm", "start" ]