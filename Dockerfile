FROM node:0.10-onbuild

MAINTAINER Clemens Stolle <klaemo@fastmail.fm>

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start-prod"]