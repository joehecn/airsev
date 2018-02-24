FROM node:carbon-alpine
ENV NPM_CONFIG_LOGLEVEL info

# Create node directory
RUN mkdir /airsev
WORKDIR /airsev

# COPY file
COPY Dockerfile /airsev
COPY package.json /airsev
COPY ./src /airsev/src

# Install app dependencies
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g pm2
RUN cnpm install --production

# 修改时区
RUN apk update && apk add bash tzdata \
    && cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

CMD npm run pro
