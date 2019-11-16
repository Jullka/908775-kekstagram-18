'use strict';

(function () {

  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var textHashtags = document.querySelector('.text__hashtags');
  var uploadFile = document.querySelector('.img-upload__input');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadClosed = document.querySelector('.img-upload__cancel');
  var errorInner = document.querySelector('.error__inner');
  var imgUploadForm = document.querySelector('.img-upload__form');
  var successButton = document.querySelector('.success__button');
  var errorButtons = document.querySelectorAll('.error__buttons');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var openOverlay = function () {
    window.imageUploadEffectLevel.classList.add('hidden');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscCloseOverlay);
    window.resetEffect();
  };

  uploadFile.addEventListener('change', openOverlay);

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
    textHashtags.style.borderColor = 'red';
    var hashtags = textHashtags.value.toLowerCase().split(' ');

    if (hashtags.length > MAX_HASHTAGS) {
      return 'Нельзя указать больше пяти хэш-тегов';
    }

    for (var i = 0; i < hashtags.length; i++) {
      var hashtag = hashtags[i];

      if (hashtag[0] !== '#') {
        return 'Хэштег должен начинаться с символа #';
      }

      if (hashtag === '#') {
        return 'Хештег не может состоять только из одной #';
      }

      var cutHashtag = hashtag.slice(1);

      if (cutHashtag.indexOf('#') !== -1) {
        return 'Хэштеги разделяются пробелами';
      }

      if (hashtags.indexOf(hashtag) !== i) {
        return 'Oдин и тот же хэштег не может быть использован дважды';
      }

      if (hashtag.length > MAX_HASHTAG_LENGTH) {
        return 'Максимальная длина одного хэштега 20 символов';
      }
    }

    return '';
  };

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

  var textDescription = document.querySelector('.text__description');
  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscCloseOverlay);
  });

  var successItem = successTemplate.cloneNode(true);
  var onSuccess = function () {
    closeOverlay();
    window.main.appendChild(successItem);


    // successButton.addEventListener('click', closeSuccessLoad);
    document.addEventListener('keydown', onEscCloseSuccessLoad);
    document.addEventListener('click', onClickCloseSuccessLoad);
  };

  var closeSuccessLoad = function () {
    successItem.remove();

    document.removeEventListener('keydown', onEscCloseSuccessLoad);
    // successButton.removeEventListener('click', closeSuccessLoad);
    document.removeEventListener('click', onClickCloseSuccessLoad);

    imgUploadForm.reset();
  };

  var onEscCloseSuccessLoad = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeSuccessLoad();
    }
  };

  var onClickCloseSuccessLoad = function (evt) {
    var successInner = window.main.querySelector('.success__inner');
    if (evt.target !== successInner && !(successInner.contains(evt.target))) {
      closeSuccessLoad();
    }
  };

  var onError = function (errorText) {
    closeOverlay();
    var errorItem = errorTemplate.cloneNode(true);
    errorItem.querySelector('.error__title').textContent = errorText;
    window.main.appendChild(errorItem);

    errorButtons.forEach(function (item) {
      item.addEventListener('click', closeErrorLoad);
    });

    document.addEventListener('keydown', onEscCloseErrorLoad, true);
    document.addEventListener('click', onClickCloseErrorLoad);
  };

  var closeErrorLoad = function () {
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
    if (evt.target !== errorInner && !(errorInner.contains(evt.target))) {
      closeErrorLoad();
    }
  };

  imgUploadForm.addEventListener('submit', function (evt) {
    window.load.send(new FormData(imgUploadForm), onSuccess, onError);
    evt.preventDefault();
  });

})();
