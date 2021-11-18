##API Server
Node Js server module which can be used to download the latest content.
Requires authentication to get a token and bearer token to download content.

API Available
/authenticate - POST
Used to authenticate 
Body: {
    username: <>,
    password: <>,
    hostname: <>
}
Generates and replies with a jwt token corresponding to user and host

/content - GET

Requires bearer token in header as well as hostname
Provides the content in csv format.