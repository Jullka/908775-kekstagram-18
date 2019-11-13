'use strict';

(function () {

  var uploadFile = document.querySelector('.img-upload__input');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadClosed = document.querySelector('.img-upload__cancel');
  var successElement = document.querySelector('.success');
  var successButton = document.querySelector('.success__button');
  var errorElement = document.querySelector('.error');
  var errorButton = document.querySelectorAll('.error__button');
  var errorInner = document.querySelector('.error__inner');

  // Закрытие нажатием ESC
  var onEscCloseOverlay = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeOverlay();
    }
  };

  // Открытие формы для редактирования фото
  var openOverlay = function () {
    window.imageUploadEffectLevel.classList.add('hidden');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscCloseOverlay);
    window.resetFilter();
  };

  uploadFile.addEventListener('change', openOverlay);

  // Закрытие формы для редактирования фото
  var closeOverlay = function () {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscCloseOverlay);
    uploadFile.value = '';
  };

  uploadClosed.addEventListener('click', function () {
    closeOverlay();
  });

  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var textHashtags = document.querySelector('.text__hashtags');

  var checkHashtags = function (userInput) {
    if (userInput === '') {
      return '';
    }

    var hashtags = userInput.toLowerCase().split(' ');

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

  // Комментарии
  var textDescription = document.querySelector('.text__description');
  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscCloseOverlay);
  });

  var closeSuccessLoad = function () {
    window.render.mainBlock.removeChild(successElement);

    document.removeEventListener('keydown', onEscCloseSuccessLoad);
    successButton.removeEventListener('click', closeSuccessLoad);
    document.removeEventListener('click', onClickCloseSuccessLoad);

    uploadOverlay.reset();
  };

  var onEscCloseSuccessLoad = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeSuccessLoad();
    }
  };

  var onClickCloseSuccessLoad = function (evt) {
    var successInner = document.querySelector('.success__inner');
    if (evt.target !== successInner && !(successInner.contains(evt.target))) {
      closeSuccessLoad();
    }
  };

  var closeErrorLoad = function () {
    window.main.removeChild(errorElement);

    for (var i = 0; i < errorButton.length; i++) {
      errorButton[i].removeEventListener('click', closeErrorLoad);
    }
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

  uploadOverlay.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.load.saveData(new FormData(uploadOverlay), window.onSuccess, window.onError);
  });

})();
