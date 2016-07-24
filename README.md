#RESTful API using hapi.js, MongoDB, SocketIO and Redis

##How to setup?

You should have a current version of node installed and a local MongoDB and Redis server running. Now just clone the repository and execute these two commands:

``` 
npm install

npm start
```
##Useful Curl commands for test purposes

``` 
curl --data "email=marcogbarcellos@gmail.com&password=Test123&firstName=Marco&lastName=Gabriel" http://localhost:8000/users

curl -X PUT --data "firstName=Heloisa" http://localhost:8000/users/SOME_ID

curl -X DELETE http://localhost:8000/users/SOME_ID
```