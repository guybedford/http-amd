//service wrapper for JSON service requests to work both client & server side
//takes data as a javascript object, sends with application/json, and accept header for application/json, including response parsing.
define(['is!browser?./ajax:./node-http', 'json/json'], function(http, JSON) {
  return {
    send: function(method, url, headers, data, callback, errback) {
      //headers argument optional
      if (typeof data != 'object') {
        errback = callback;
        callback = data;
        data = headers;
        headers = {};
      }
      //data optional
      if (typeof data == 'function') {
        callback = data;
        data = undefined; //(JSON.stringify(undefined) = undefined)
      }
      
      var _headers = {};
      for (var header in headers)
        _headers[header] = headers[header];
      
      _headers['Content-Type'] = 'application/json; charset=utf-8';
      _headers.accept = 'application/json';
      
      http.send(method, url, _headers, JSON.stringify(data), callback ? function(data) {
        try {
          callback(data ? JSON.parse(data) : null);
        }
        catch (e) {
          if (errback)
            errback(e);
          else
            throw(e);
        }
      } : null, function(xhr) {
        if (xhr.response)
          try {
            xhr.response = JSON.parse(xhr.response) : null;
          }
          catch(e) {}
        errback(xhr);
      });
    },
    post: function(url, headers, data, callback, errback) {
      this.send('POST', url, headers, data, callback, errback);
    },
    get: function(url, headers, callback, errback) {
      this.send('GET', url, headers, null, callback, errback);
    },
    put: function(url, headers, data, callback, errback) {
      this.send('PUT', url, headers, data, callback, errback);
    },
    del: function(url, headers, callback, errback) {
      this.send('DELETE', url, headers, null, callback, errback);
    }
  };
});
