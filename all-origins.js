var request = require('request');
var zlib    = require('zlib');
var config  = require('./config');

module.exports = {
  processRequest: processRequest
};
function isURL(str) {
		return /^(https?):\/\/((?:[a-z0-9.-]|%[0-9A-F]{2}){3,})(?::(\d+))?((?:\/(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})*)*)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i.test(str);
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

function processRequest(req, res) {
    var start = new Date(),
        _url = req.query.url.toString();
    if(!_url.startsWith('http')) {
        _url = 'http://' + _url;
    }
    if(typeof req.query.url != 'undefined' && req.query.url.length > 6 && isURL(_url)) {
        request({
            url: _url,
            encoding: null,
            headers: {
                'User-Agent': config.userAgent
            }
        },
        function(error, response, body) {
            var _response =
            {
                contents: (error != null) ? error.toString() : body.toString(),
                status: {
                    'url': unescape(_url),
                    'content_type': (error != null) ?  '' : response.headers['content-type'],
                    'http_code': (error != null) ? '0' : response.statusCode,
                    'response_time': (new Date() - start)
                }
            };

            if ((error == null) && response.headers['content-encoding'] == 'gzip') {
                zlib.gunzip(body, function(err, dezipped) {
                    _response.contents = dezipped.toString();
                    res.jsonp(_response);
                });
            } else {
                res.jsonp(_response);
            }
        });
    }
    else {
        res.jsonp({});
    }
}
