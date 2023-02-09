# node 16-3.11 v로 base이미지를 지정합니다.
FROM node:16-alpine3.16

# RUN 커맨드를 사용하여 작업디렉토리를 생성합니다.
# Create working directory
RUN mkdir -p /usr/src/app
# 작업디렉토리 지정
WORKDIR /usr/src/app

# Copy package.json file to working directory
COPY package*.json ./
RUN sudo apt install npm
# npm 명령어 실행해 명시된 노드 패키지들을 실행합니다.
RUN npm install

# Copy project
COPY . ./

CMD [ "npm", "start" ]