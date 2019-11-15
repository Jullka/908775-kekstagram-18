'use strict';
(function () {
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var main = document.querySelector('main');
  var filters = document.querySelector('.img-filters');
  var popularFilter = document.querySelector('#filter-popular');
  var randomFilter = document.querySelector('#filter-random');
  var discussedFilter = document.querySelector('#filter-discussed');
  var FHOTO_NUMBER = 10;


  var setActiveButton = function (button) {
    randomFilter.classList.remove('img-filters__button--active');
    discussedFilter.classList.remove('img-filters__button--active');
    popularFilter.classList.remove('img-filters__button--active');
    button.classList.add('img-filters__button--active');
  };

  var renderSubset = window.debounce(function (selector, array) {
    window.renderData(selector(array));
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

    window.renderData(pictures);
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
  window.main = main;

})();
