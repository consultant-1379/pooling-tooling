FROM armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/node:lts-alpine3.15

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install \
&& npm prune \
&& npm cache clean --force

COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "run-script", "start" ]
