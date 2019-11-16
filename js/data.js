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

  var showComments = function (comments) {
    var count = 0;
    var setCommentCounter = function () {
      if (count <= comments.length) {
        var str = commentCount.innerHTML;
        str = count + str.slice(str.indexOf(' '));
        commentCount.innerHTML = str;
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

  var renderBigPicture = function (picture) {
    bigPictureElement.classList.remove('hidden');
    body.classList.add('modal-open');
    window.currentComments = showComments(picture.comments);

    bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
    bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
    bigPictureElement.querySelector('.social__caption').alt = picture.description;
    bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;

    window.currentComments.show();
    bigPictureCancelBtn.addEventListener('click', closeBigPicture);
    commentsButton.addEventListener('click', window.currentComments.show);
    document.addEventListener('keydown', onEscBigPitureClose);
  };

  var onClickCommentButton = function () {
    window.currentComments.show();
  };

  var closeBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    commentCount.classList.remove('visually-hidden');
    commentsButton.classList.remove('visually-hidden');
    body.classList.remove('modal-open');

    document.removeEventListener('keydown', onEscBigPitureClose);
    commentsButton.removeEventListener('click', onClickCommentButton);
  };

  var onEscBigPitureClose = function (evt) {
    if (evt.keyCode === window.KEYCODE.ESC) {
      closeBigPicture();
    }
  };

  window.renderData = function (data) {
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPicture(data[i]));
    }

    Array.from(picturesContainer.querySelectorAll('.picture')).forEach(function (picture) {
      picturesContainer.removeChild(picture);
    });

    picturesContainer.appendChild(fragment);
  };

})();

