const Lab    = require("lab");           
const lab    = exports.lab = Lab.script(); 
const Code   = require("code");      
const server = require("../server.js").server; 

let firstUserId,
    scheduleId;

lab.experiment("User endpoints", function() {
    
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
            server.stop(done);  
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
            Code.expect(response.result.dateCreated).to.exist();
            Code.expect(response.result.dateUpdated).to.not.exist();
            firstUserId = response.result._id;  
            server.stop(done);  
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
            server.stop(done);  
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
            server.stop(done);  
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
            server.stop(done);  
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
            server.stop(done);  
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
            server.stop(done);  
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
            server.stop(done);  
        });
    });

});


lab.experiment("Schedule endpoints", function() {
    
    lab.test("should not create schedule without required fields", function(done) {
        let options = {
            method: "POST",
            url: "/schedules",
            payload :{
                firstUserId: firstUserId
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(400);  
            server.stop(done);  
        });
    });

    lab.test("should create new schedule", function(done) {
        let today = new Date();
        let options = {
            method: "POST",
            url: "/schedules",
            payload :{
                firstUserId    : firstUserId,
                currencyWanted : "CAD",
                value          : 45.0,
                dateFrom       : today,
                dateTo         : today,
                latitude       : -22.0,
                longitude      : -43.0
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.not.be.null();
            Code.expect(response.result.dateCreated).to.exist();
            Code.expect(response.result.dateUpdated).to.not.exist();
            scheduleId = response.result._id;  
            server.stop(done);  
        });
    });

    lab.test("should update schedule", function(done) {
        let options = {
            method: "PUT",
            url: "/schedules/"+scheduleId,
            payload :{
                latitude       : -22.7,
                longitude      : -43.4
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  
        });
    });

    lab.test("should not allow to update schedule creator", function(done) {
        let options = {
            method: "PUT",
            url: "/schedules/"+scheduleId,
            payload :{
                firstUserId : 'fakeUserId'
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(400);  
            server.stop(done);  
        });
    });

    lab.test("GET all schedules", function(done) {
        let options = {
            method: "GET",
            url: "/schedules"
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.result).to.be.an.array();
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  
        });
    });

    lab.test("should delete schedule", function(done) {
        let options = {
            method: "DELETE",
            url: "/schedules/"+scheduleId
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  
        });
    });

    lab.test("should not delete schedule already deleted", function(done) {
        let options = {
            method: "DELETE",
            url: "/schedules/"+scheduleId
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(404);  
            server.stop(done);  
        });
    });

});

lab.experiment("User+Schedule endpoints", function() {

    lab.test("should not return schedules from unexistent user", function(done) {
        let options = {
            method: "GET",
            url: "/users/"+firstUserId+"/schedules"
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(404);  
            server.stop(done);  
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
            Code.expect(response.result.dateCreated).to.exist();
            Code.expect(response.result.dateUpdated).to.not.exist();
            firstUserId = response.result._id;  
            server.stop(done);  
        });
    });

    lab.test("should create new schedule", function(done) {
        let today = new Date();
        let options = {
            method: "POST",
            url: "/schedules",
            payload :{
                firstUserId    : firstUserId,
                currencyWanted : "CAD",
                value          : 45.0,
                dateFrom       : today,
                dateTo         : today,
                latitude       : -22.0,
                longitude      : -43.0
            }
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.not.be.null();
            Code.expect(response.result.dateCreated).to.exist();
            Code.expect(response.result.dateUpdated).to.not.exist();
            scheduleId = response.result._id;  
            server.stop(done);  
        });
    });

    lab.test("should return schedules from user", function(done) {
        let options = {
            method: "GET",
            url: "/users/"+firstUserId+"/schedules"
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  
        });
    });

    lab.test("should delete schedule", function(done) {
        let options = {
            method: "DELETE",
            url: "/schedules/"+scheduleId
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  
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
            server.stop(done);  
        });
    });

});    