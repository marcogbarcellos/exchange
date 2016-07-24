const Lab    = require("lab");           
const lab    = exports.lab = Lab.script(); 
const Code   = require("code");      
const server = require("../server.js").server; 

lab.experiment("User endpoints", function() {
    // tests
    lab.test("GET all users", function(done) {
        let options = {
            method: "GET",
            url: "/users"
        };
        // server.inject lets you similate an http request
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);  
            server.stop(done);  // done() callback is required to end the test.
        });
    });
});