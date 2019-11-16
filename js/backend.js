'use strict';

(function () {

  var URL = {
    GET: 'https://js.dump.academy/kekstagram/data',
    POST: 'https://js.dump.academy/kekstagram'
  };
  var SUCCESSSTATUS = 200;
  var XHRTIMEOUT = 10000;

  var generateXhr = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = XHRTIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESSSTATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      if (xhr.statusText !== 200) {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      }
    });
    return xhr;
  };

  var load = function (onSuccess, onError) {
    var xhr = generateXhr(onSuccess, onError);

    xhr.open('GET', URL.GET);
    xhr.send();
  };

  var send = function (data, onSuccess, onError) {
    var xhr = generateXhr(onSuccess, onError);

    xhr.open('POST', URL.POST);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    send: send,
  };

})();
