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

  var selectRandomPictures = function (pictures) {
    var randomPictures = [];
    var getRandomPicture = function () {
      var randomIndex = Math.floor(Math.random() * Math.floor(pictures.length));
      return pictures[randomIndex];
    };
    while (randomPictures.length < PHOTO_NUMBER) {
      var randomPicture = getRandomPicture(pictures);
      if (!randomPictures.includes(randomPicture)) {
        randomPictures.push(randomPicture);
      }
    }
    return randomPictures;
  };

  var listenRandomBtnClick = function (pictures) {
    randomFilter.addEventListener('click', function () {
      setActiveButton(randomFilter);
      renderSubset(selectRandomPictures, pictures);
    });
  };

  var selectDiscussedPictures = function (pictures) {
    return pictures.slice()
      .sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
  };

  var listenDiscussedBtnClick = function (pictures) {
    discussedFilter.addEventListener('click', function () {
      setActiveButton(discussedFilter);
      renderSubset(selectDiscussedPictures, pictures);
    });
  };

  var selectPopularPictures = function (pictures) {
    return pictures;
  };

  var listenPopularBtnClick = function (pictures) {
    popularFilter.addEventListener('click', function () {
      setActiveButton(popularFilter);
      renderSubset(selectPopularPictures, pictures);
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
