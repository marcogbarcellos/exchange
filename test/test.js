const Lab    = require("lab");           
const lab    = exports.lab = Lab.script(); 
const Code   = require("code");      
const server = require("../server.js").server; 

lab.experiment("User endpoints", function() {
    let firstUserId;
    
    lab.test("should not create user without required fields", function(done) {
        let options = {
            method: "POST",
            url: "/users",
            payload :{
                firstName : 'user',
                lastName  : 'test'
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(400);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

    lab.test("should create new user", function(done) {
        let options = {
            method: "POST",
            url: "/users",
            payload :{
                firstName : 'user',
                lastName  : 'test',
                email     : 'test.user@gmail.com',
                password  : 'testPass123',
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.not.be.null();
            Code.expect(response.result.dateUpdated).to.not.be.null();
            firstUserId = response.result._id;  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

    lab.test("should not create user with duplicate email on database", function(done) {
        let options = {
            method: "POST",
            url: "/users",
            payload :{
                firstName : 'user',
                lastName  : 'test',
                email     : 'test.user@gmail.com',
                password  : 'testPass123',
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(403);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

    lab.test("should update user", function(done) {
        let options = {
            method: "PUT",
            url: "/users/"+firstUserId,
            payload :{
                firstName : 'newFirstName',
                lastName  : 'newLastName'
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

    lab.test("should not allow to update user email", function(done) {
        let options = {
            method: "PUT",
            url: "/users/"+firstUserId,
            payload :{
                email : 'newEmail@exchange.com'
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(400);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

    lab.test("GET all users", function(done) {
        let options = {
            method: "GET",
            url: "/users"
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.result).to.be.an.array();
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

    lab.test("should delete user", function(done) {
        let options = {
            method: "DELETE",
            url: "/users/"+firstUserId
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

    lab.test("should not delete user already deleted", function(done) {
        let options = {
            method: "DELETE",
            url: "/users/"+firstUserId
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(404);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });

});