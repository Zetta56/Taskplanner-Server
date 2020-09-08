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

OPTIONAL: You can enable Google OAuth2 with the following:
1. Navigate to https://console.developers.google.com.

2. Click "Create a new project" and title it.

3. Go to the Credentials tab on the right (upper-right on mobile) and configure your consent screen.

4. Go back to Credentials and click "Create Credentials" => "OAuth Client ID"

5. Set it to web application, add your project's URL to "Authorized Javascript Origins", and click "Submit".

6. You should see your client id. If you do, add the following to your project's environment variables and replace YOUR_CLIENT_ID with your client id:

       process.env.GOOGLE_CLIENTID=YOUR_CLIENT_ID
      
   Note: You should also enable Google OAuth2 in your [Taskplanner-client](https://github.com/Zetta56/Taskplanner-client).
