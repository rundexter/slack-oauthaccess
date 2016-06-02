var req  = require('superagent')
  , _    = require('lodash')
  , q    = require('q')
;

module.exports = {
  run: function(step, dexter) {
    var deferred      = q.defer()
      , code          = step.input('code').first()
      , client_id     = dexter.provider('slack').credentials('client_id')
      , client_secret = dexter.provider('slack').credentials('client_secret')
      , self          = this
    ;

    if(!code) return this.fail('Code is required');

    req.post('https://slack.com/api/oauth.access')
      .type('form')
      .send({ client_id: client_id, client_secret: client_secret, code: code })
      .end(deferred.makeNodeResolver())
    ; 

    deferred.promise
      .then(function(result) {
        self.complete(result.body);
      })
      .catch(this.fail.bind(this))
    ;
  }
};
