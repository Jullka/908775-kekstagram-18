'use strict';
(function () {

  var PHOTO_NUMBER = 10;

  var main = document.querySelector('main');
  var filters = document.querySelector('.img-filters');
  var popularFilter = document.querySelector('#filter-popular');
  var randomFilter = document.querySelector('#filter-random');
  var discussedFilter = document.querySelector('#filter-discussed');

  var setActiveButton = function (button) {
    randomFilter.classList.remove('img-filters__button--active');
    discussedFilter.classList.remove('img-filters__button--active');
    popularFilter.classList.remove('img-filters__button--active');
    button.classList.add('img-filters__button--active');
  };

  var renderSubset = window.throttling.debounce(function (selector, array) {
    window.preview.renderData(selector(array));
  });

  var selectRandomPictures = function (picturesArr) {
    var randomPicturesArr = [];
    var getRandomPicture = function () {
      var randomIndex = Math.floor(Math.random() * Math.floor(picturesArr.length));
      return picturesArr[randomIndex];
    };
    while (randomPicturesArr.length < PHOTO_NUMBER) {
      var randomPicture = getRandomPicture(picturesArr);
      if (!randomPicturesArr.includes(randomPicture)) {
        randomPicturesArr.push(randomPicture);
      }
    }
    return randomPicturesArr;
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

    window.preview.renderData(pictures);
    listenRandomBtnClick(pictures);
    listenDiscussedBtnClick(pictures);
    listenPopularBtnClick(pictures);

    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    }
  };

  window.backend.load(onSuccess, window.onError);

  window.filters = {
    main: main
  };

})();
