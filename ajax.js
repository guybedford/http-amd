/*
 * A general, but simple RequireJS AJAX function
 *
 */
define(function() {
  var ajax = {};
  
  /* XHR code - copied from RequireJS text plugin */
  var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
  var XMLHttpRequest;
  
  // the most general possible ajax function, all arguments required
  ajax.send = function(method, url, headers, async, data, callback, errback) {
    var xhr, i, progId;
    if (typeof XMLHttpRequest !== 'undefined')
      xhr = new XMLHttpRequest();
    else if (typeof ActiveXObject !== 'undefined')
      for (i = 0; i < 3; i += 1) {
        progId = progIds[i];
        try {
          xhr = new ActiveXObject(progId);
        }
        catch (e) {}
  
        if (xhr) {
          progIds = [progId];  // so faster next time
          break;
        }
      }
    
    xhr.open(method, url, async);
    
    for (var header in headers)
      xhr.setRequestHeader(header, headers[header]);
    
    xhr.onreadystatechange = function(evt) {
      var status, err;
      //Do not explicitly handle errors, those should be
      //visible via console output in the browser.
      if (xhr.readyState === 4) {
        status = xhr.status;
        if (status > 399 && status < 600) {
          //An http 4xx or 5xx error. Signal an error.
          err = new Error(url + ' HTTP status: ' + status);
          err.xhr = xhr;
          errback(err);
        }
        else
          callback(xhr.responseText);
      }
    }
    
    xhr.send(data);
  }
  
  //the convenient ajax functions
  ajax.get = function(url, headers, callback, errback) {
    //headers argument optional
    if (typeof headers == 'function') {
      errback = callback;
      callback = headers;
      headers = {};
    }
    ajax.send('GET', url, headers, true, null, callback, errback);
  }
  ajax.post = function(url, data, headers, callback, errback) {
    //headers argument optional
    if (typeof headers == 'function') {
      errback = callback;
      callback = headers;
      headers = {};
    }
    ajax.send('POST', url, headers, true, data, callback, errback);
  }
  return ajax;
});
