# use node 16 alpine as parent
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the files
COPY . .

# expose port 5000
EXPOSE 5000

# start the app
CMD ["npm", "start"]

