
var Server            = require('./util/Server.js')
var MockAuthStrategy  = require('./util/MockAuthStrategy.js')

var assert  = Object.create(require('assert'))
assert.falsey = function (v) { return assert.ok(!v); }
var request = require('request')
var seneca  = require('seneca')()

// set to true to keep the server running
var DEBUG = false

describe('integration test', function() {

  var mockStrategy = new MockAuthStrategy({'foo': 'bar'})
  var server
  before(function(done) {
    server = new Server(seneca)
    server.start(function() {
      mockStrategy.mock('foo', seneca)
      done()
    })
  })

  after(function(done) {
    if(DEBUG) {
      this.timeout(5*60*1000)
    } else {
      server.stop(done)
    }
  })

  it('login should fail with wrong login', function(done) {
    var r = request
      .post('http://localhost:3000/auth/login', 
        {
          json: true,
          body: {username: 'foo', password: 'bar'}
        }, 
        function (err, httpResponse, body) {
          assert.falsey(err);
          assert.equal(httpResponse.statusCode, 401);
          assert.falsey(body.ok);
          assert.equal(body.why, 'user-not-found');
          done(err)
        })

  })

})
