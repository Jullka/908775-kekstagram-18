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

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
    return pictureElement;
  };

  var createFragment = function (pictures) {
    pictures.forEach(function (pictureElement) {
      fragment.appendChild(renderPicture(pictureElement));
    });
    similarListElement.appendChild(fragment);
  };

  var bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');
  var commentsList = document.querySelector('.social__comments');
  var commentElement = document.querySelectorAll('.social__comment');
  var commentCountElement = document.querySelector('.social__comment-count');
  var commentsLoader = document.querySelector('.comments-loader');

  var renderBigPicture = function (picture) {
    var bigPictureCommentsCount = picture.comments.length;
    bigPicture.querySelector('big-picture__img').querySelector('img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = bigPictureCommentsCount;
    bigPicture.querySelector('.social__caption').textContent = picture.description;


    for (var i = 0; i < commentElement.length; i++) {
      commentsList.removeChild(commentsList[i]);
    }

    var socialElementFragment = document.createDocumentFragment();

    for (var j = 0; j < bigPictureCommentsCount; j++) {
      var comment = commentElement.cloneNode(true);
      comment.querySelector('img').src = picture.comments[j].avatar;
      comment.querySelector('img').alt = picture.comments[j].name;
      comment.querySelector('.social__text').textContent = picture.comments[j].message;

      socialElementFragment.appendChild(comment);
    }

    commentElement.appendChild(socialElementFragment);

    commentsLoader.classList.add('visually-hidden');
    commentCountElement.classList.add('visually-hidden');
  };
  var elements = renderPicture();
  renderBigPicture(elements[0]);

  var onError = function (errorText) {
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__title').textContent = errorText;
    main.appendChild(errorElement);
  };

  window.load(createFragment, onError);

})();
