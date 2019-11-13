'use strict';

(function () {

  var similarListElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var fragment = document.createDocumentFragment();
  var main = document.querySelector('main');
  var bigPictureElement = document.querySelector('.big-picture');
  var commentCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoader = bigPictureElement.querySelector('.comments-loader');
  var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    pictureElement.addEventListener('click', function (evt) {
      evt.preventDefault();
      renderBigPicture(picture);
    });

    return pictureElement;
  };

  var renderBigPicture = function (picture) {
    bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
    bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
    bigPictureElement.querySelector('.social__caption').alt = picture.description;
    bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;
    var commentElements = bigPictureElement.querySelectorAll('.social__comment');
    for (var i = 0; i < commentElements.length; i++) {
      if (picture.comments[i]) {
        commentElements[i].querySelector('.social__picture').src = picture.comments[i].avatar;
        commentElements[i].querySelector('.social__picture').alt = picture.comments[i].name;
        commentElements[i].querySelector('.social__text').textContent = picture.comments[i].message;
      }
    }

    document.addEventListener('keydown', onEscPressCloseBigPiture);
    commentsLoader.classList.add('visually-hidden');
    commentCountElement.classList.add('visually-hidden');
    bigPictureElement.classList.remove('hidden');
  };

  var onEscPressCloseBigPiture = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeBigPicture();
    }
  };

  var closeBigPicture = function () {
    bigPictureElement.classList.add('hidden');

    document.removeEventListener('keydown', onEscPressCloseBigPiture);
  };

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });

  var onSuccess = function (pictures) {
    for (var i = 0; i < pictures.length; i++) {
      fragment.appendChild(renderPicture(pictures[i]));
    }
    similarListElement.appendChild(fragment);

    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    }
  };

  var onError = function (errorText) {
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__title').textContent = errorText;
    main.appendChild(errorElement);
  };

  window.load.load(onSuccess, onError);

  window.onSuccess = onSuccess;
  window.onError = onError;

})();
