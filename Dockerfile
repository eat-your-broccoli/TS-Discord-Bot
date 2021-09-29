FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive


RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

# Initial update and some basics.
# This odd double update seems necessary to get curl to download without 404 errors.
RUN apt-get update --fix-missing && \
apt-get install -y wget && \
apt-get update && \
apt-get install -y curl && \
apt-get update


# Get ffmpeg
RUN apt-get update --fix-missing
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:savoury1/multimedia && \
apt-get update --fix-missing
RUN apt-get install -y ffmpeg


# install nodejs and npm
# based on https://github.com/nodejs/docker-node
ENV NODE_VERSION 14.15.0
RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz"

# Create directory for application
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "start:docker" ]
