FROM yourtion/node-ffmpeg

WORKDIR /app
EXPOSE 9100
ENTRYPOINT [ "npm", "start" ]

COPY package.json /app/package.json
RUN npm install --production

COPY ./src /app/src
