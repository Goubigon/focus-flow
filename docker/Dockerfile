FROM node:20

RUN apt-get update
RUN apt-get install -y git mariadb-client openssl


RUN git clone https://github.com/Goubigon/focus-flow.git

WORKDIR focus-flow
RUN mkdir certificates

RUN npm install

EXPOSE 8000

COPY entry-point.sh ./entry-point.sh
RUN chmod +x entry-point.sh

ENTRYPOINT ./entry-point.sh
