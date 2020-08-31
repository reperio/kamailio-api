FROM node:10.15-alpine

RUN apk update 
RUN apk add curl

# needed for bcrypt
# Install everything (and clean up afterwards)
RUN apk add \
    autoconf \
    automake \
    g++ \
    libpng-dev \
    libtool \
    make \
    nasm \
    python \
    git

RUN mkdir -p /opt/app
WORKDIR /opt/app

RUN npm install -g nodemon
RUN npm install -g yarn

COPY . .

RUN rm -rf /opt/app/node_modules
RUN yarn

CMD ["node", "index.js"]
