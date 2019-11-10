'use strict';

(function () {
  var uploadFile = document.querySelector('.img-upload__input');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadClosed = document.querySelector('.img-upload__cancel');

  // Закрытие нажатием ESC
  var onEscPress = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeOverlay();
    }
  };

  // Открытие формы для редактирования фото
  var openOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
    window.resetFilter();
  };

  uploadFile.addEventListener('change', openOverlay);

  // Закрытие формы для редактирования фото
  var closeOverlay = function () {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
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
    document.removeEventListener('keydown', onEscPress);
  });

  textHashtags.addEventListener('blur', function () {
    document.addEventListener('keydown', onEscPress);
    checkHashtags(textHashtags);
  });

  // Комментарии
  var textDescription = document.querySelector('.text__description');
  textDescription.addEventListener('focus', function () {
    document.removeEventListener('keydown', onEscPress);
  });

})();
