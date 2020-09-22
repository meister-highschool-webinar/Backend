FROM node:lts
WORKDIR /
RUN cd / && git clone -b develop --single-branch https://github.com/meister-highschool-webinar/Backend.git
WORKDIR /Backend
RUN npm install

WORKDIR /Backend/webinar-api
CMD ["node", "./bin/www"]

