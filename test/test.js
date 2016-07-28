const Lab = require("lab");
const sinon = require('sinon');
const mongoose = require('mongoose');
const lab = exports.lab = Lab.script();
const Code = require("code");
const server = require("../server.js").server;
const db = require("../config/database.js");
const today = new Date();

let stubFind, testFind, testFindOne, testSave, testUpdate, testRemove, 
stubRemoveNotFound, stubSave, firstUserId, scheduleId, stubFunction, 
stubfindByIdAndUpdate, stubfindOneNotFound, stubfindByIdAndUpdateNotFound;


lab.experiment("User endpoints", function() {

  lab.test("should not create user without required fields", function(done) {
    let options = {
      method: "POST",
      url: "/users",
      payload: {
        firstName: 'user',
        lastName: 'test'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      server.stop(done);
    });
  });

  lab.test("should create new user", function(done) {
    let options = {
      method: "POST",
      url: "/users",
      payload: {
        firstName: 'user',
        lastName: 'test',
        email: 'test.user@gmail.com',
        password: 'testPass123'
      }
    };

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
      payload: {
        firstName: 'user',
        lastName: 'test',
        email: 'test.user@gmail.com',
        password: 'testPass123'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(403);
      server.stop(done);
    });
  });

  lab.test("should update user", function(done) {
    let options = {
      method: "PUT",
      url: "/users/" + firstUserId,
      payload: {
        firstName: 'newFirstName',
        lastName: 'newLastName'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should not update user email", function(done) {
    let options = {
      method: "PUT",
      url: "/users/" + firstUserId,
      payload: {
        firstName: 'newFirstName',
        email: 'new@email.com'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      server.stop(done);
    });
  });

  lab.test("should not allow to update user email", function(done) {
    let options = {
      method: "PUT",
      url: "/users/" + firstUserId,
      payload: {
        email: 'newEmail@exchange.com'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      server.stop(done);
    });
  });

  lab.test("should find user", function(done) {
    let options = {
      method: "GET",
      url: "/users/" + firstUserId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });


  lab.test("should delete user", function(done) {
    let options = {
      method: "DELETE",
      url: "/users/" + firstUserId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should not delete user already deleted", function(done) {
    let options = {
      method: "DELETE",
      url: "/users/" + firstUserId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.test("GET all users", function(done) {
    let options = {
      method: "GET",
      url: "/users"
    };

    server.inject(options, function(response) {
      Code.expect(response.result).to.be.an.array();
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });


});


lab.experiment("Schedule endpoints", function() {

  lab.test("should not create schedule without required fields", function(done) {
    let options = {
      method: "POST",
      url: "/schedules",
      payload: {
        firstUserId: firstUserId
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(400);
      server.stop(done);
    });
  });

  lab.test("should create new schedule", function(done) {

    let options = {
      method: "POST",
      url: "/schedules",
      payload: {
        firstUserId: firstUserId,
        currencyWanted: "CAD",
        value: 45.0,
        dateFrom: today,
        dateTo: today,
        latitude: -22.0,
        longitude: -43.0
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.not.be.null();
      Code.expect(response.result.dateCreated).to.exist();
      Code.expect(response.result.dateUpdated).to.not.exist();
      scheduleId = response.result._id;
      server.stop(done);
    });
  });

  lab.test("should get one schedule", function(done) {
    let options = {
      method: "GET",
      url: "/schedules/" + scheduleId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should update schedule", function(done) {
    let options = {
      method: "PUT",
      url: "/schedules/" + scheduleId,
      payload: {
        latitude: -22.7,
        longitude: -43.4
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should not allow to update schedule creator", function(done) {
    let options = {
      method: "PUT",
      url: "/schedules/" + scheduleId,
      payload: {
        firstUserId: 'fakeUserId'
      }
    };

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

    server.inject(options, function(response) {
      Code.expect(response.result).to.be.an.array();
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should delete schedule", function(done) {
    let options = {
      method: "DELETE",
      url: "/schedules/" + scheduleId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should not delete schedule already deleted", function(done) {
    let options = {
      method: "DELETE",
      url: "/schedules/" + scheduleId
    };

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
      url: "/users/" + firstUserId + "/schedules"
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.test("should create new user", function(done) {
    let options = {
      method: "POST",
      url: "/users",
      payload: {
        firstName: 'user',
        lastName: 'test',
        email: 'test.user@gmail.com',
        password: 'testPass123'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.not.be.null();
      Code.expect(response.result.dateCreated).to.exist();
      Code.expect(response.result.dateUpdated).to.not.exist();
      firstUserId = response.result._id;
      server.stop(done);
    });
  });

  lab.test("should return empty array of schedules from user", function(done) {
    let options = {
      method: "GET",
      url: "/users/" + firstUserId + "/schedules"
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should create new schedule", function(done) {

    let options = {
      method: "POST",
      url: "/schedules",
      payload: {
        firstUserId: firstUserId,
        currencyWanted: "CAD",
        value: 45.0,
        dateFrom: today,
        dateTo: today,
        latitude: -22.0,
        longitude: -43.0
      }
    };

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
      url: "/users/" + firstUserId + "/schedules"
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should delete schedule", function(done) {
    let options = {
      method: "DELETE",
      url: "/schedules/" + scheduleId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });

  lab.test("should delete user", function(done) {
    let options = {
      method: "DELETE",
      url: "/users/" + firstUserId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      server.stop(done);
    });
  });
});

lab.experiment("User Endpoints - Mocking/Stub Mongoose.Model functions: ", function() {

  lab.beforeEach((done) => {

    let options = {
      method: "POST",
      url: "/users",
      payload: {
        firstName: 'New',
        lastName: 'User',
        email: 'new.user@gmail.ca',
        password: 'testPass123'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      firstUserId = response.result._id;

      stubFunction = function(data, cb) {
        var err = new Error('MongoDb Error');
        return cb(err, null);
      }

      stubSave = function(cb) {
        var err = new Error('MongoDb Error');
        return cb(err, null);
      }
      stubfindByIdAndUpdate = function(a, b, c, cb) {
        var err = new Error('MongoDb Error');
        return cb(err, null);
      }

      // stub the mongoose find() and return mock find 
      testFind = sinon.stub(mongoose.Model, 'find', stubFunction);
      testFindOne = sinon.stub(mongoose.Model, 'findOne', stubFunction);
      testSave = sinon.stub(mongoose.Model.prototype, 'save', stubSave);
      testRemove = sinon.stub(mongoose.Model, 'findByIdAndRemove', stubFunction);
      testUpdate = sinon.stub(mongoose.Model, 'findByIdAndUpdate', stubfindByIdAndUpdate);


      server.stop(done);
    });

  });


  lab.test("Find", function(done) {
    let options = {
      method: "GET",
      url: "/users"
    };


    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(500);
      server.stop(done);
    });
  });

  lab.test("Save", function(done) {
    let options = {
      method: "POST",
      url: "/users",
      payload: {
        firstName: 'user',
        lastName: 'test',
        email: 'test.user@gmail.com',
        password: 'testPass123'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(403);
      server.stop(done);
    });
  });

  lab.test("Update - Mongo Error", function(done) {
    let options = {
      method: "PUT",
      url: "/users/" + firstUserId,
      payload: {
        firstName: 'newFirstName',
        lastName: 'newLastName'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(403);
      server.stop(done);
    });
  });


  lab.test("Update - Not Found", function(done) {
    let options = {
      method: "PUT",
      url: "/users/" + firstUserId,
      payload: {
        firstName: 'newFirstName',
        lastName: 'newLastName'
      }
    };

    testUpdate.restore();
    stubfindByIdAndUpdateNotFound = function(a, b, c, cb) {
      return cb(null, null);
    }

    testUpdate = sinon.stub(mongoose.Model, 'findByIdAndUpdate', stubfindByIdAndUpdateNotFound);

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.test("Find One - Mongo Error", function(done) {
    let options = {
      method: "GET",
      url: "/users/" + firstUserId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(500);
      server.stop(done);
    });
  });

  lab.test("Find One - User Not Found", function(done) {
    let options = {
      method: "GET",
      url: "/users/" + firstUserId
    };

    testFindOne.restore();
    //Simulate User Not Found
    stubfindOneNotFound = function(data, cb) {
      return cb(null, null);
    }

    testFindOne = sinon.stub(mongoose.Model, 'findOne', stubfindOneNotFound);

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.test("Delete One - Mongo Error", function(done) {
    let options = {
      method: "DELETE",
      url: "/users/" + firstUserId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(500);
      server.stop(done);
    });
  });

  lab.test("Delete One - User Not Found", function(done) {
    let options = {
      method: "DELETE",
      url: "/users/" + firstUserId
    };

    testRemove.restore();

    //Simulate User Not Found
    stubRemoveNotFound = function(data, cb) {
      return cb(null, null);
    }

    testRemove = sinon.stub(mongoose.Model, 'findByIdAndRemove', stubRemoveNotFound);

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.afterEach((done) => {
    // Removing Stubs from mongoose methods  
    testFind.restore();
    testFindOne.restore();
    testSave.restore();
    testUpdate.restore();
    testRemove.restore();

    //Deleting user Created
    let options = {
      method: "DELETE",
      url: "/users/" + firstUserId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);

      server.stop(done);
    });
  });

});


lab.experiment("Schedule Endpoints - Mocking/Stub Mongoose.Model functions: ", function() {

  // Creating User and Schedule and Stub Functions
  lab.beforeEach((done) => {

    let options = {
      method: "POST",
      url: "/users",
      payload: {
        firstName: 'Schedul',
        lastName: 'User',
        email: 'new.schedul@gmail.ca',
        password: 'testPass123'
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(200);
      firstUserId = response.result._id;

      options = {
        method: "POST",
        url: "/schedules",
        payload: {
          firstUserId: firstUserId,
          currencyWanted: "CAD",
          value: 45.0,
          dateFrom: today,
          dateTo: today,
          latitude: -22.0,
          longitude: -43.0
        }
      };


      server.inject(options, function(response) {
        Code.expect(response.statusCode).to.equal(200);
        scheduleId = response.result._id;

        stubFunction = function(data, cb) {
          var err = new Error('MongoDb Error');
          return cb(err, null);
        }

        stubSave = function(cb) {
          var err = new Error('MongoDb Error');
          return cb(err, null);
        }

        stubfindByIdAndUpdate = function(a, b, c, cb) {
          var err = new Error('MongoDb Error');
          return cb(err, null);
        }

        // stub the mongoose find() and return mock find 
        testFind = sinon.stub(mongoose.Model, 'find', stubFunction);
        testFindOne = sinon.stub(mongoose.Model, 'findOne', stubFunction);
        testSave = sinon.stub(mongoose.Model.prototype, 'save', stubSave);
        testRemove = sinon.stub(mongoose.Model, 'findByIdAndRemove', stubFunction);
        testUpdate = sinon.stub(mongoose.Model, 'findByIdAndUpdate', stubfindByIdAndUpdate);


        server.stop(done);
      });
    });

  });


  lab.test("Find", function(done) {
    let options = {
      method: "GET",
      url: "/schedules"
    };


    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(500);
      server.stop(done);
    });
  });

  lab.test("Save", function(done) {
    let options = {
      method: "POST",
      url: "/schedules",
      payload: {
        firstUserId: firstUserId,
        currencyWanted: "CAD",
        value: 45.0,
        dateFrom: today,
        dateTo: today,
        latitude: -22.0,
        longitude: -43.0
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(403);
      server.stop(done);
    });
  });

  lab.test("Update - Mongo Error", function(done) {
    let options = {
      method: "PUT",
      url: "/schedules/" + scheduleId,
      payload: {
        latitude: -22.7,
        longitude: -43.4
      }
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(403);
      server.stop(done);
    });
  });


  lab.test("Update - Not Found", function(done) {
    let options = {
      method: "PUT",
      url: "/schedules/" + scheduleId,
      payload: {
        latitude: -22.7,
        longitude: -43.4
      }
    };

    testUpdate.restore();
    stubfindByIdAndUpdateNotFound = function(a, b, c, cb) {
      return cb(null, null);
    }

    testUpdate = sinon.stub(mongoose.Model, 'findByIdAndUpdate', stubfindByIdAndUpdateNotFound);

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.test("Find One - Mongo Error", function(done) {
    let options = {
      method: "GET",
      url: "/schedules/" + scheduleId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(500);
      server.stop(done);
    });
  });

  lab.test("Find One - User Not Found", function(done) {
    let options = {
      method: "GET",
      url: "/schedules/" + scheduleId
    };

    testFindOne.restore();
    //Simulate User Not Found
    stubfindOneNotFound = function(data, cb) {
      return cb(null, null);
    }

    testFindOne = sinon.stub(mongoose.Model, 'findOne', stubfindOneNotFound);

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.test("Delete One - Mongo Error", function(done) {
    let options = {
      method: "DELETE",
      url: "/schedules/" + scheduleId
    };

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(500);
      server.stop(done);
    });
  });

  lab.test("Delete One - User Not Found", function(done) {
    let options = {
      method: "DELETE",
      url: "/schedules/" + scheduleId
    };

    testRemove.restore();

    //Simulate User Not Found
    stubRemoveNotFound = function(data, cb) {
      return cb(null, null);
    }

    testRemove = sinon.stub(mongoose.Model, 'findByIdAndRemove', stubRemoveNotFound);

    server.inject(options, function(response) {
      Code.expect(response.statusCode).to.equal(404);
      server.stop(done);
    });
  });

  lab.afterEach((done) => {
    // Removing Stubs from mongoose methods  
    testFind.restore();
    testSave.restore();
    testFindOne.restore();
    testUpdate.restore();
    testRemove.restore();
    //Deleting schedule Created
    let options = {
      method: "DELETE",
      url: "/schedules/" + scheduleId
    };

    server.inject(options, function(response) {


      //Deleting User
      let options = {
        method: "DELETE",
        url: "/users/" + firstUserId
      };

      server.inject(options, function(response) {
        Code.expect(response.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });

});
