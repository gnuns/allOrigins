All Origins
=======

An open source alternative to AnyOrigin.com with support to gzipped pages and CORS

***"Same-Origin-Policy? Not on my watch."***

A free and open source javascript clone of [AnyOrigin](http://anyorigin.com/), inspired on [Whatever Origin](http://WhateverOrigin.org), but with support to gzipped pages.

#### Use it

Usage is similar to anyorigin and whateverorigin. For example, to fetch the data from http://google.com with jQuery, use this snippet:

```js
$.getJSON('http://allorigins.us/get?url=' + encodeURIComponent('http://google.com') + '&callback=?', function(data){
    alert(data.contents);
});
```

Or via https

```js
$.getJSON('https://allorigins.us/get?url=' + encodeURIComponent('https://google.com') + '&callback=?', function(data){
    alert(data.contents);
});
```

You can also set the response character encoding (charset):

```js
$.getJSON('https://allorigins.us/get?charset=ISO-8859-1&url=' + encodeURIComponent('https://google.com') + '&callback=?', function(data){
    alert(data.contents);
});
```

To get the the raw content (CORS), just add ```&method=raw```

```js
$.get('https://allorigins.us/get?method=raw&url=' + encodeURIComponent('https://google.com') + '&callback=?', function(data){
    console.log(data);
});
```

#### On your own server
```sh

# Clone the repo
git clone https://github.com/gnuns/AllOrigins

# Install dependencies
cd allorigins
npm install

# Fire it up!
node server.js # the default port is 1458
```
