FROM node:lts
WORKDIR /
RUN git clone https://github.com/meister-highschool-webinar/Backend.git
RUN git checkout develop
WORKDIR /Backend
RUN npm install

WORKDIR /Backend/webinar-api
CMD ["node", "./bin/www"]

