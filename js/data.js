'use strict';

(function () {

  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var fragment = document.createDocumentFragment();
  var main = document.querySelector('main');
  var bigPictureElement = document.querySelector('.big-picture');
  // var commentCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoader = bigPictureElement.querySelector('.comments-loader');
  // var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');
  var filters = document.querySelector('.img-filters');
  var popularFilter = document.querySelector('#filter-popular');
  var randomFilter = document.querySelector('#filter-random');
  var discussedFilter = document.querySelector('#filter-discussed');
  var commentElementList = document.querySelector('.social__comments');
  var socialPicture = document.querySelector('.social__picture');
  var socialText = document.querySelector('.social__text');
  var FHOTO_NUMBER = 10;
  var COMMENT_NUMBER = 5;

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

  var renderComment = function (element) {
    var comment = commentElementList.cloneNode(true);

    socialPicture.src = element.avatar;
    socialPicture.alt = element.name;

    socialText.textContent = element.message;

    return comment;
  };


  var renderBigPicture = function (picture) {
    bigPictureElement.classList.remove('hidden');

    bigPictureElement.querySelector('.big-picture__img img').src = picture.url;
    bigPictureElement.querySelector('.likes-count').textContent = picture.likes;
    bigPictureElement.querySelector('.social__caption').alt = picture.description;

    commentElementList.innerHTML = '';
    bigPictureElement.querySelector('.comments-count').textContent = picture.comments.length;

    if (picture.comments.length > COMMENT_NUMBER) {
      commentsLoader.classList.remove('visually-hidden');
    }

    picture.comments.slice(0, 5).forEach(function (comment) {
      fragment.appendChild(renderComment(comment));
    });

    commentElementList.appendChild(fragment);

    commentsLoader.addEventListener('click', function (evt) {
      evt.preventDefault();
      commentsLoader.classList.add('visually-hidden');


      picture.comments.slice(5).forEach(function (comment) {
        fragment.appendChild(renderComment(comment));
      });
      commentElementList.appendChild(fragment);
    });
    renderComment(picture[0].comments[0]);
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

  var renderData = function (data) {
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPicture(data[i]));
    }

    Array.from(picturesContainer.querySelectorAll('.picture')).forEach(function (picture) {
      picturesContainer.removeChild(picture);
    });

    picturesContainer.appendChild(fragment);
  };

  var setActiveButton = function (button) {
    randomFilter.classList.remove('img-filters__button--active');
    discussedFilter.classList.remove('img-filters__button--active');
    popularFilter.classList.remove('img-filters__button--active');
    button.classList.add('img-filters__button--active');
  };

  var renderSubset = window.debounce(function (selector, array) {
    renderData(selector(array));
  });

  var selectRandomPictures = function (picturesArr) {
    var array = [];
    var getRandomPicture = function () {
      var randomIndex = Math.floor(Math.random() * Math.floor(picturesArr.length));
      return picturesArr[randomIndex];
    };
    while (array.length < FHOTO_NUMBER) {
      var randomPicture = getRandomPicture(picturesArr);
      if (!array.includes(randomPicture)) {
        array.push(randomPicture);
      }
    }
    return array;
  };

  var listenRandomBtnClick = function (picturesArr) {
    randomFilter.addEventListener('click', function () {
      setActiveButton(randomFilter);
      renderSubset(selectRandomPictures, picturesArr);
    });
  };

  var selectDiscussedPictures = function (picturesArr) {
    return picturesArr.slice()
      .sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
  };

  var listenDiscussedBtnClick = function (picturesArr) {
    discussedFilter.addEventListener('click', function () {
      setActiveButton(discussedFilter);
      renderSubset(selectDiscussedPictures, picturesArr);
    });
  };

  var selectPopularPictures = function (picturesArr) {
    return picturesArr;
  };

  var listenPopularBtnClick = function (picturesArr) {
    popularFilter.addEventListener('click', function () {
      setActiveButton(popularFilter);
      renderSubset(selectPopularPictures, picturesArr);
    });
  };

  var onSuccess = function (pictures) {

    filters.classList.remove('img-filters--inactive');

    renderData(pictures);
    listenRandomBtnClick(pictures);
    listenDiscussedBtnClick(pictures);
    listenPopularBtnClick(pictures);

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
