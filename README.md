# This-Is-Chat application

## Overview

`This-Is-Chat` is a simple single-room chat application that uses `WebSockets` to deliver
messages to all logged-in users in real-time.

The application uses React for frontend, Express/Node.js for backend and uses MongoDB for peristence (Uses MongoDB's Atlas service). Auth0 is used for user management.

## Running Locally

### Frontend

Clone the frontend repo (this repo) and the backend repo (this-is-chat-be). Run the following
commands to start frontend:

```
cd this-is-chat-fe
yarn start
```

### Backend

Change directory to backend repo and start backend application as follows:

```
cd this-is-chat-be
yarn start
```

### MongoDB

Start a docker container:

```
docker run -d --name chatmongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
```

## Deployment

The application is deployed to Render using their free-tier hosting.

* frontend is deployed as a static site.
* backend is deployed as a web service.
* for database, the application uses MongoDB's Atlas service.


## Additional Features

### Multi-room feature

Working on adding multi-room feature to the application
