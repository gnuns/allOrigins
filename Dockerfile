FROM node:14-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
COPY ./package-lock.json /usr/src/app/
ENV NODE_ENV production
RUN npm ci
COPY . /usr/src/app
CMD [ "npm", "run", "start" ]
