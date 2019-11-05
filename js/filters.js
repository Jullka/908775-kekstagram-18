'use strict';

(function () {
  var effects = {
    none: {
      class: 'effects__preview--none',
    },
    chrome: {
      class: 'effects__preview--chrome',
      effectName: 'grayscale',
      min: 0,
      max: 1,
      points: ''
    },
    sepia: {
      class: 'effects__preview--sepia',
      effectName: 'sepia',
      min: 0,
      max: 1,
      points: ''
    },
    marvin: {
      class: 'effects__preview--marvin',
      effectName: 'invert',
      min: 0,
      max: 100,
      points: '%'
    },
    phobos: {
      class: 'effects__preview--phobos',
      effectName: 'blur',
      min: 0,
      max: 3,
      points: 'px'
    },
    heat: {
      class: 'effects__preview--heat',
      effectName: 'brightness',
      min: 0,
      max: 3,
      points: ''
    }
  };

  var effectsList = document.querySelector('.effects');

  effectsList.addEventListener('change', function (evt) {
    var currentEffect = effects[evt.target.value];
    effectFill(currentEffect, 1);
  });

  var effectFill = function (effect, value) {
    var previewPicture = window.imgUploadPreview.querySelector('img');
    var satiety = (effect.max - effect.min) * value + effect.min;
    previewPicture.style.filter = effect.effectName + '(' + satiety + effect.points + ')';
    window.imgUploadPreview.classList = 'img-upload__preview';
    previewPicture.classList.add(effect.class);
  };

  var getSliderValue = function (currentValue, maxValue) {
    var onePercentSize = maxValue / 100;
    return Math.round(currentValue / onePercentSize);
  };

  var effectLevelPin = document.querySelector('.effect-level__pin');

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    console.log('test');
    var startCoordsX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      console.log('test');
      var shiftX = startCoordsX - moveEvt.clientX;
      var position = effectLevelPin.offsetLeft - shiftX;
      startCoordsX = moveEvt.clientX;

      if (position <= 0) {
        position = 0;
      }

      if (position >= 453) {
        position = 453;
      }

      effectLevelPin.style.left = position + 'px';
      var sliderValue = getSliderValue(position, 453);
      var currentEffect = effects[evt.target.value];
      effectFill(currentEffect, sliderValue);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      console.log('test');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
