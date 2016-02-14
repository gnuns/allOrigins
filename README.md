All Origins
=======

An open source alternative to AnyOrigin.com with support to gzipped pages

***"Same-Origin-Policy? Not on my watch."***

A free and open source javascript clone of [AnyOrigin](http://anyorigin.com/), inspired on [Whatever Origin](http://WhateverOrigin.org), but with support to gzipped pages.

#### Use it

Usage is similar to anyorigin and whateverorigin. For example, to fetch the data from http://google.com with jQuery, use this snippet:

```js
$.getJSON('http://allorigins.pw/get?url=' + encodeURIComponent('http://google.com') + '&callback=?', function(data){
    alert(data.contents);
});
```

Or via https

```js
$.getJSON('https://allorigins.pw/get?url=' + encodeURIComponent('https://google.com') + '&callback=?', function(data){
    alert(data.contents);
});
```

#### On your own server
```sh

# Clone the repo
git clone https://github.com/hezag/allorigins

# Install dependencies
cd allorigins
npm install

# Fire it up!
node server.js # the default port is 14570
```
