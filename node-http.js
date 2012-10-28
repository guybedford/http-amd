define(['http', 'url'], function(http, urlParser) {
  return {
    headers: {},
    setHeader: function(header, value) {
      this.headers[header] = value;
    },
    
    //headers, callback, errback optional
    send: function(method, url, headers, data, callback, errback) {
      if (typeof headers != 'object') {
        errback = callback;
        callback = data;
        data = headers;
        headers = {};
      }
      
      var requestOptions = urlParser.parse(url);
      
      requestOptions.headers = headers;
      for (var header in this.headers)
        requestOptions.headers[header] = this.headers[header];
      requestOptions.headers['Content-Length'] = str_data != undefined ? str_data.length : 0
      
      requestOptions.method = method;
      
      var _data = [];
      var _req = http.request(requestOptions, function(_res) {
        _res.setEncoding('utf8');
        _res.on('data', function (chunk) {
          _data.push(chunk);
        });
        _res.on('end', function() {
          try {
            _data = JSON.parse(_data.join(''));
          }
          catch (e) {
            if (errback)
              errback('Unable to parse JSON response.');
            return;
          }
          if (callback)
            callback(_data);
        });
      });
      if (errback)
        _req.on('error', errback);
      _req.end(data);
    },
    get: function(url, headers, callback, errback) {
      this.send('GET', url, headers, null, callback, errback);
    },
    post: function(url, headers, data, callback, errback) {
      this.send('POST', url, headers, data, callback, errback);
    },
    put: function(url, headers, data, callback, errback) {
      this.send('PUT', url, headers, data, callback, errback);
    },
    del: function(url, headers, callback, errback) {
      this.send('DELETE', url, headers, null, callback, errback);
    }
  };
});
