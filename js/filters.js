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
    var previewPicture = window.imgUploadPreview.querySelector('img');
    previewPicture .style.filter = currentEffect.effectName + '(' + currentEffect.max + currentEffect.points + ')';
    window.imgUploadPreview.classList = 'img-upload__preview';
    previewPicture.classList.add(currentEffect.class);
  });

})();
