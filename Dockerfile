FROM node:14-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./yarn.lock /usr/src/app/
ENV NODE_ENV production
RUN yarn install
COPY . /usr/src/app
CMD [ "npm", "run", "start" ]
