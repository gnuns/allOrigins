/*!
 * AllOrigins
 * written by Gabriel 'Hezag' Nunes <tohezag@gmail.com>
 * http://github.com/hezag
 */

var express = require('express'),
    app     = express(),
    router  = express.Router(),
    request = require("request"),
    zlib    = require('zlib'),
    url     = require('url');

var port = 14570;
var appUserAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36';

router.get('/get', function(req, res) {
    var start = new Date();
    if(typeof req.query.url != "undefined" && req.query.url.length > 6) {
        var _url = req.query.url;
        request({
            url: _url,
            encoding: null,
            headers: {
                'User-Agent': appUserAgent
            }
        },
        function(error, response, body) {
            var _response =
            {
                contents: body.toString(),
                status: {
                    "url": unescape(_url),
                    "content_type": response.headers['content-type'],
                    "http_code": response.statusCode,
                    "response_time": (new Date() - start)
                }
            };

            if (response.headers['content-encoding'] == 'gzip') {
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
});

app.use(router);
app.listen(port);
console.log('Listening on ' + port);
