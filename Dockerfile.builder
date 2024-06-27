FROM node:16

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y git

RUN git clone https://github.com/comeyrd/homepage .

WORKDIR /usr/src/app/templating
RUN npm install

# Build the static website
CMD ["node", "index.js"]
