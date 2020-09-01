# Taskplanner
A highly interactive web app that lets users manage and organize their everyday tasks. This repository contains code for the backend server of the project, built with NodeJS, ExpressJS, MongoDB, and PassportJS.

## Requirements
This server requires the following:

   1. Node.js
   2. npm
    
## Usage
1. Create a `.env` file at the root directory and add the following lines:

       process.env.DATABASEURL="YOUR MONGODB"
       process.env.ACCESS_TOKEN="ACCESS SECRET"
       process.env.REFRESH_TOKEN="REFRESH SECRET"
       
   Make sure to replace "YOUR MONGODB" with the URL to your Mongo database, as well as "ACCESS SECRET" and "REFRESH SECRET" to any strings you like.
   
   You can set up a Mongo database on the cloud at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or follow [these instructions](https://docs.mongodb.com/manual/installation/) to make one locally.
   
   Alternatively, if you are deploying this to a cloud platform, you can store environment variables directly to your deployment settings instead of storing them in your `.env` file.

2. Install all necessary dependencies with:
       
       npm install
       
3. Start the server with:

       node server.js
