'use strict';
(function () {

  var PIN_MAX_POSITION = 453;
  var PIN_MIN_POSITION = 0;
  var effectsList = document.querySelector('.effects');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var imageUploadEffectLevel = document.querySelector('.img-upload__effect-level');
  var startX = PIN_MIN_POSITION;

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

  var selectedEffect = effects.none;

  window.resetEffect = function () {
    effectLevelPin.style.left = PIN_MAX_POSITION + 'px';
    effectLevelDepth.style.width = PIN_MAX_POSITION + 'px';
    window.imgUploadPreview.style.filter = '';
  };

  var effectFill = function (effect, value) {
    var previewPicture = window.imgUploadPreview.querySelector('img');
    var satiety = (effect.max - effect.min) * value + effect.min;
    previewPicture.style.filter = effect.effectName + '(' + satiety + effect.points + ')';
    window.imgUploadPreview.classList = 'img-upload__preview';
    previewPicture.classList.add(effect.class);
  };

  var getSliderValue = function (currentValue, maxValue) {
    var onePercentSize = maxValue / 100;
    return Math.round(currentValue / onePercentSize) / 100;
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shiftX = startX - moveEvt.clientX;
    startX = moveEvt.clientX;
    var position = effectLevelPin.offsetLeft - shiftX;

    if (position < PIN_MIN_POSITION || position > PIN_MAX_POSITION) {
      return;
    } else {
      effectLevelPin.style.left = position + 'px';
    }

    effectLevelDepth.style.width = effectLevelPin.style.left;
    var sliderValue = getSliderValue(position, PIN_MAX_POSITION);
    effectFill(selectedEffect, sliderValue);
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    startX = evt.clientX;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  effectsList.addEventListener('change', function (evt) {
    var currentEffect = effects[evt.target.value];
    selectedEffect = currentEffect;

    imageUploadEffectLevel.classList.remove('hidden');

    effectFill(currentEffect, 1);
    window.resetEffect();

  });

  window.imageUploadEffectLevel = imageUploadEffectLevel;

})();
