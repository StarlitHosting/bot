FROM node:lts-alpine as build-runner

WORKDIR /tmp/app

COPY package.json .

RUN npm install

COPY src ./src
COPY tsconfig.json   .

RUN npm run build

FROM node:lts-alpine as prod-runner

WORKDIR /app

COPY --from=build-runner /tmp/app/package.json /app/package.json

RUN npm install --omit=dev

COPY --from=build-runner /tmp/app/dist /app/dist

CMD [ "npm", "run", "start" ]