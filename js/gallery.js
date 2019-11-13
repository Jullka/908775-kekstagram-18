'use strict';

(function () {
  var scaleControlSmaller = document.querySelector('.scale__control--smaller');
  var scaleControlBigger = document.querySelector('.scale__control--bigger');
  var scaleControlValue = document.querySelector('.scale__control--value');
  var scaleControlNumber = parseInt(scaleControlValue.value, 10);
  var imgUploadPreview = document.querySelector('.img-upload__preview');

  var ScaleValue = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  scaleControlBigger.addEventListener('click', function () {
    if (scaleControlNumber < ScaleValue.MAX) {
      scaleControlNumber += ScaleValue.STEP;
      scaleControlValue.value = scaleControlNumber + '%';
      imgUploadPreview.querySelector('img').style.transform = 'scale(' + (scaleControlNumber / 100) + ')';
    }
  });

  scaleControlSmaller.addEventListener('click', function () {
    if (scaleControlNumber > ScaleValue.MIN) {
      scaleControlNumber -= ScaleValue.STEP;
      scaleControlValue.value = scaleControlNumber + '%';
      imgUploadPreview.querySelector('img').style.transform = 'scale(' + (scaleControlNumber / 100) + ')';
    }
  });

  window.imgUploadPreview = imgUploadPreview;

})();
