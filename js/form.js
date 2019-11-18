'use strict';

(function () {

  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;

  var HashtagError = {
    MAX_QUANTITY: 'Нельзя указывать более 5-ти хэш-тегов',
    FIRST_SYMBOL: 'Xэш-тег должен начинаться с символа #',
    LENGTH: 'Хэш-тег не может состоять только из одной решётки',
    SPACE: 'Хэштеги разделяются пробелами',
    UNIQUENESS: 'Один и тот же хэш-тег не может быть использован дважды',
    MAX_LENGTH: 'Максимальная длина одного хэш-тега 20 символов, включая решётку'
  };

  var textHashtags = document.querySelector('.text__hashtags');
  var textDescription = document.querySelector('.text__description');
  var uploadFile = document.querySelector('.img-upload__input');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadClosed = document.querySelector('.img-upload__cancel');
  var imgUploadForm = document.querySelector('.img-upload__form');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var openOverlay = function () {
    window.effects.imageUploadEffectLevel.classList.add('hidden');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscCloseOverlay);
    window.effects.resetEffect();
    window.effects.clearEffect();
  };

  uploadFile.addEventListener('change', openOverlay);
  imgUploadForm.reset();

  var closeOverlay = function () {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscCloseOverlay);
    uploadFile.value = '';
  };

  uploadClosed.addEventListener('click', function () {
    closeOverlay();
  });

  var onEscCloseOverlay = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeOverlay();
    }
  };

  var checkHashtags = function (userInput) {
    if (userInput === '') {
      return '';
    }

    var hashtags = textHashtags.value.toLowerCase().split(' ');

    if (hashtags.length > MAX_HASHTAGS) {
      return HashtagError.MAX_QUANTITY;
    }

    for (var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];

      if (hashtag[0] !== '#') {
        return HashtagError.FIRST_SYMBOL;
      }

      if (hashtag === '#') {
        return HashtagError.LENGTH;
      }

      var cutHashtag = hashtag.slice(1);

      if (cutHashtag.indexOf('#') !== -1) {
        return HashtagError.SPACE;
      }

      if (hashtags.indexOf(hashtag) !== i) {
        return HashtagError.UNIQUENESS;
      }

      if (hashtag.length > MAX_HASHTAG_LENGTH) {
        return HashtagError.MAX_LENGTH;
      }
    }

    return '';
  };

  imgUploadForm.addEventListener('invalid', function (evt) {
    evt.target.style.border = '1px solid red';
  }, true);

  textHashtags.addEventListener('change', function () {
    var hashtagError = checkHashtags(textHashtags.value);
    textHashtags.setCustomValidity(hashtagError);
  });

  textHashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscCloseOverlay);
  });

  textHashtags.addEventListener('blur', function () {
    document.addEventListener('keydown', onEscCloseOverlay);
    checkHashtags(textHashtags);
  });

  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscCloseOverlay);
  });

  var successItem = successTemplate.cloneNode(true);

  var onSuccess = function () {
    closeOverlay();
    window.filters.main.appendChild(successItem);
    var successButton = successItem.querySelector('.success__button');
    successButton.addEventListener('click', closeSuccessLoad);
    document.addEventListener('keydown', onEscCloseSuccessLoad);
    document.addEventListener('click', onClickCloseSuccessLoad);
  };

  var closeSuccessLoad = function () {
    successItem.remove();

    document.removeEventListener('keydown', onEscCloseSuccessLoad);
    document.removeEventListener('click', onClickCloseSuccessLoad);

    imgUploadForm.reset();
  };

  var onEscCloseSuccessLoad = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeSuccessLoad();
    }
  };

  var onClickCloseSuccessLoad = function (evt) {
    var successInner = window.filters.main.querySelector('.success__inner');
    if (evt.target !== successInner && !(successInner.contains(evt.target))) {
      closeSuccessLoad();
    }
  };

  var errorItem = errorTemplate.cloneNode(true);
  var errorButtons = errorItem.querySelectorAll('.error__button');

  var onError = function (errorText) {
    closeOverlay();
    errorItem.querySelector('.error__title').textContent = errorText;
    window.filters.main.appendChild(errorItem);
    errorButtons.forEach(function (item) {
      item.addEventListener('click', closeErrorLoad);
    });
    errorItem.style = 'z-index: 100;';

    document.addEventListener('keydown', onEscCloseErrorLoad, true);
    errorButtons.forEach(function (item) {
      item.addEventListener('click', closeErrorLoad);
    });
    document.addEventListener('click', onClickCloseErrorLoad);
  };

  var closeErrorLoad = function () {
    errorItem.remove();
    errorButtons.forEach(function (item) {
      item.removeEventListener('click', closeErrorLoad);
    });

    document.removeEventListener('keydown', onEscCloseErrorLoad, true);
    document.removeEventListener('click', onClickCloseErrorLoad);
  };

  var onEscCloseErrorLoad = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeErrorLoad();
    }
  };

  var onClickCloseErrorLoad = function (evt) {
    var errorInner = document.querySelector('.error__inner');
    if (evt.target !== errorInner && !(errorInner.contains(evt.target))) {
      closeErrorLoad();
    }
  };

  imgUploadForm.addEventListener('submit', function (evt) {
    window.backend.send(new FormData(imgUploadForm), onSuccess, onError);
    evt.preventDefault();
  });

})();
