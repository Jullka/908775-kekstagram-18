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
  var commentCountElement = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoader = bigPictureElement.querySelector('.comments-loader');
  var bigPictureCancel = bigPictureElement.querySelector('.big-picture__cancel');
  var filters = document.querySelector('.img-filters');
  var popularFilter = document.querySelector('#filter-popular');
  var randomFilter = document.querySelector('#filter-random');
  var discussedFilter = document.querySelector('#filter-discussed');
  var FHOTO_NUMBER = 10;

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

  var renderPicturesArray = function (pictures) {
    for (var i = 0; i < pictures.length; i++) {
      fragment.appendChild(renderPicture(pictures[i]));
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
    renderPicturesArray(selector(array));
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

  var listenRandomBtnClick = function (photosArr) {
    randomFilter.addEventListener('click', function () {
      setActiveButton(randomFilter);
      renderSubset(selectRandomPictures, photosArr);
    });
  };

  var selectDiscussedPictures = function (photosArr) {
    return photosArr.slice()
      .sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
  };

  var listenDiscussedBtnClick = function (photosArr) {
    discussedFilter.addEventListener('click', function () {
      setActiveButton(discussedFilter);
      renderSubset(selectDiscussedPictures, photosArr);
    });
  };

  var selectPopularPictures = function (photosArr) {
    return photosArr;
  };

  var listenPopularBtnClick = function (photosArr) {
    popularFilter.addEventListener('click', function () {
      setActiveButton(popularFilter);
      renderSubset(selectPopularPictures, photosArr);
    });
  };

  var onSuccess = function (pictures) {

    filters.classList.remove('img-filters--inactive');

    renderPicturesArray(pictures);
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
