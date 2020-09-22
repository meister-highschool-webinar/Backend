FROM node:lts
WORKDIR /
ADD package.json /Backend/
WORKDIR /Backend
RUN npm install
ADD webinar-api /Backend/webinar-api
WORKDIR /Backend/webinar-api
CMD ["node", "./bin/www"]
