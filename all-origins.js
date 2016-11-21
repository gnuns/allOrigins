var request = require('request');
var zlib    = require('zlib');
var config  = require('./config');

module.exports = {
  processRequest: processRequest
};

function processRequest(req, res) {
  var start = new Date();
  var params = req.query;

  if (isValidURL(params.url)) {
    getPageContent(params.url)
    .then(function (page) {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      
      if (params.method  && params.method === 'raw') {
        res.set('Content-Type', page.response.headers['content-type']);
        return res.send(page.content);
      }

      var response = {
        contents: page.content.toString(),
        status: {
          'url': unescape(params.url),
          'content_type': page.response.headers['content-type'],
          'http_code': page.response.statusCode,
          'response_time': (new Date() - start)
        }
      };
      return res.jsonp(response);
    })
    .catch((err) => res.status(400).json({'error': err}));
  } else return res.status(400).json({'error': 'invalid url'});
}

function getPageContent(url) {
  return new Promise(resolver);

  function resolver(resolve, reject) {
    var requesOptions = {
      'url': url,
      'encoding': null,
      'headers': {
        'User-Agent': config.userAgent
      }
    };
    request(requesOptions, function(error, response) {
      if (error) return reject(error);
      processContent(response)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
    });
  }
}

function processContent(response) {
  return new Promise(resolver);

  function resolver(resolve, reject) {
    var res = {'response': response, 'content': response.body};

    if (response.headers['content-encoding'] == 'gzip') {
      return zlib.gunzip(res.content, function(err, dezipped) {
        if (err) return reject(err);
        resolve(res);
      });
    }
    resolve(res);
  }
}

function isValidURL(str) {
  if(typeof str === 'undefined' || str.length <= 6) return false;
	return /^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i.test(str);
}
