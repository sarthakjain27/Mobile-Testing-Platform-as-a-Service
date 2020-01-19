# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:8.11.4

# Set the working directory to /client
WORKDIR /df

# copy package.json into the container at /client
COPY package*.json /df/

# install dependencies
RUN npm install

# Copy the current directory contents into the container at /client
COPY . /df/

# Make port 3000 available to the world outside this container
EXPOSE 8080

# Run the app when the container launches
CMD ["npm", "run", "start:dev"]