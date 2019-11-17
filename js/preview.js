'use strict';

(function () {

  var COMMENT_NUMBER = 5;

  var picturesContainer = document.querySelector('.pictures');
  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCancelBtn = bigPictureElement.querySelector('.big-picture__cancel');
  var commentElementList = document.querySelector('.social__comments');
  var commentsButton = bigPictureElement.querySelector('.comments-loader');
  var commentElement = document.querySelector('.social__comment');
  var commentCount = bigPictureElement.querySelector('.social__comment-count');
  var body = document.querySelector('body');
  var fragment = document.createDocumentFragment();
  var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture');
  var currentComments;

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

  var printCommentCount = function (element, count, total) {
    element.textContent = count + ' ' + 'из' + ' ' + total + ' ' + 'коментариев';
  };

  var showComments = function (comments) {
    var count = 0;
    var setCommentCounter = function () {
      if (count <= comments.length) {
        printCommentCount(commentCount, count, comments.length);
      } else {
        commentCount.classList.add('visually-hidden');
        commentsButton.classList.add('visually-hidden');
      }
    };

    var renderComments = function () {
      if (count <= comments.length) {
        comments.slice(count, count + COMMENT_NUMBER)
          .forEach(function (item) {
            var comment = commentElement.cloneNode(true);

            comment.querySelector('.social__picture').src = item.avatar;
            comment.querySelector('.social__picture').alt = item.name;
            comment.querySelector('.social__text').textContent = item.message;

            fragment.appendChild(comment);
          });
        count += COMMENT_NUMBER;
        setCommentCounter();
      }

      commentElementList.appendChild(fragment);
    };

    return {
      show: function () {
        renderComments();
      }
    };
  };

  var onCommentButtonClick = function () {
    currentComments.show();
  };

  var renderBigPicture = function (picture) {
    bigPictureElement.classList.remove('hidden');
    body.classList.add('modal-open');
    currentComments = showComments(picture.comments);

    var children = Array.from(commentElementList.children);
    children.forEach(function (item) {
      commentElementList.removeChild(item);
    });

    bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
    bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
    bigPictureElement.querySelector('.social__caption').alt = picture.description;
    bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;

    currentComments.show();
    bigPictureCancelBtn.addEventListener('click', closeBigPicture);
    commentsButton.addEventListener('click', onCommentButtonClick);
    document.addEventListener('keydown', onEscBigPitureClose);
  };

  var closeBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    commentCount.classList.remove('visually-hidden');
    commentsButton.classList.remove('visually-hidden');
    commentsButton.removeEventListener('click', onCommentButtonClick);
    document.removeEventListener('keydown', onEscBigPitureClose);
    body.classList.remove('modal-open');
  };

  var onEscBigPitureClose = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeBigPicture();
    }
  };

  var renderData = function (data) {
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPicture(data[i]));
    }

    Array.from(picturesContainer.querySelectorAll('.picture')).forEach(function (picture) {
      picturesContainer.removeChild(picture);
    });

    picturesContainer.appendChild(fragment);
  };

  window.preview = {
    renderData: renderData
  };

})();

