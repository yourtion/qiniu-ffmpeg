FROM yourtion/node-ffmpeg

WORKDIR /app

COPY ./app/package.json /app/package.json
RUN npm install --production

COPY ./app/src /app/src

EXPOSE 9100
CMD [ "npm", "start" ]
