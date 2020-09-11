FROM node:lts

WORKDIR /webinar-api


COPY ./webinar-api /webinar-api
RUN npm install


CMD ["node", "./bin/www"]

