All Origins
=======
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgnuns%2FAllOrigins.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgnuns%2FAllOrigins?ref=badge_shield)
[![Build Status](https://travis-ci.com/gnuns/allOrigins.svg?branch=master)](https://travis-ci.com/gnuns/allOrigins)
[![Donate!](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/donate?hosted_button_id=7S3KJ8CA43DX6)

Pull contents from any page via API (as JSON/P or raw) and avoid [Same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) problems.


----

A free and open source javascript clone of [AnyOrigin](https://web.archive.org/web/20180807170914/http://anyorigin.com/), inspired by [Whatever Origin](http://WhateverOrigin.org), but with support to gzipped pages.

### Examples

To `fetch` data from http://wikipedia.org:

```js
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://wikipedia.org')}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(data => console.log(data.contents));
```

Or with jQuery

```js
$.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent('https://wikipedia.org'), function (data) {
    alert(data.contents);
});
```
### Options

###### charset
**Description:** Set the response character encoding (charset)  \
**Example:** `https://api.allorigins.win/get?charset=ISO-8859-1&url=https://pt.wikipedia.org/`


###### raw
**Description:** Get the raw contents ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS))  \
**Example:** `https://api.allorigins.win/raw?url=https://example.org/`

###### callback
**Description:** Get a [JSONP](https://www.w3schools.com/js/js_json_jsonp.asp) response  \
**Example:** `https://api.allorigins.win/get?callback=myFunc&url=https://example.org/`


### On your own server
```sh

# Clone the repo
git clone https://github.com/gnuns/AllOrigins

# Install dependencies
cd AllOrigins
npm install

# Fire it up!
npm start # the default port is 1458
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fgnuns%2FAllOrigins.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fgnuns%2FAllOrigins?ref=badge_large)
