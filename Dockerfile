FROM yourtion/node-ffmpeg

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --production

COPY ./src /app/src

RUN ls 

EXPOSE 9100
ENTRYPOINT [ "npm", "start" ]
