FROM node:16-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./.yarnrc.yml /usr/src/app/
COPY ./yarn.lock /usr/src/app/
COPY ./.yarn/ /usr/src/app/.yarn
ENV NODE_ENV production
RUN yarn install --immutable
COPY . /usr/src/app
CMD [ "npm", "run", "start" ]
