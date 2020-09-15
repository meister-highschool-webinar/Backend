FROM node:lts
WORKDIR /
RUN git clone -b devlop --single-branch https://github.com/meister-highschool-webinar/Backend.git
WORKDIR /Backend
RUN npm install

WORKDIR /Backend/webinar-api
CMD ["node", "./bin/www"]

