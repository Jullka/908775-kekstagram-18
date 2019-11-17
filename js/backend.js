'use strict';

(function () {

  var SUCCESS_STATUS = 200;
  var XHR_TIMEOUT = 10000;
  var URL = {
    LOAD_DATA: 'https://js.dump.academy/kekstagram/data',
    SAVE_DATA: 'https://js.dump.academy/kekstagram'
  };

  var generateXhr = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = XHR_TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      if (xhr.statusText !== SUCCESS_STATUS) {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      }
    });
    return xhr;
  };

  var load = function (onSuccess, onError) {
    var xhr = generateXhr(onSuccess, onError);

    xhr.open('GET', URL.LOAD_DATA);
    xhr.send();
  };

  var send = function (data, onSuccess, onError) {
    var xhr = generateXhr(onSuccess, onError);

    xhr.open('POST', URL.SAVE_DATA);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    send: send,
  };

})();
