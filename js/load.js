'use strict';

(function () {
  var URL = {
    get: 'https://js.dump.academy/kekstagram/data',
    post: 'https://js.dump.academy/kekstagram'
  };
  var successStatus = 200;
  var xhrTimeout = 1000;

  var generateXhr = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = xhrTimeout;
    xhr.addEventListener('load', function () {
      if (xhr.status === successStatus) {
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

    xhr.open('GET', URL.get);
    xhr.send();
  };

  var send = function (data, onSuccess, onError) {
    var xhr = generateXhr(onSuccess, onError);

    xhr.open('POST', URL.post);
    xhr.send(data);
  };

  window.load = {
    load: load,
    send: send
  };
})();
