'use strict';

var similarListElement = document.querySelector('.pictures');
var similarPictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var NAMES = ['Денис', 'Алла', 'Евгений', 'Вера', 'Роман', 'Сергей'];
var likes = {
  MIN: 15,
  MAX: 200
};
var PICTURE_NUMBER = 25;
var avatar = {
  MIN: 1,
  MAX: 6
};

var randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomData = function () {
  var randomPicture = [];
  for (var i = 1; i <= PICTURE_NUMBER; i++) {
    randomPicture.push({
      url: 'photos/' + i + '.jpg',
      description: 'Описание фото',
      likes: randomInt(likes.MIN, likes.MAX),
      comments: getRandomComment(randomInt(0, 5))
    });
  }
  return randomPicture;
};

var getRandomComment = function (countOfComments) {
  var comments = [];
  for (var i = 0; i < countOfComments; i++) {
    comments.push({
      avatar: 'img/avatar-' + randomInt(avatar.MIN, avatar.MAX) + '.svg',
      message: getRandomMassage(),
      name: NAMES[randomInt(0, NAMES.length)]
    });
  }
  return comments;
};

var getRandomMassage = function () {
  var massage = '';
  for (var i = 0; i < randomInt(1, 2); i++) {
    massage += COMMENTS[randomInt(0, COMMENTS.length)];
  }
  return massage;
};

var renderPicture = function (picture) {
  var pictureElement = similarPictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
  return pictureElement;
};

var createFragment = function () {
  var pictures = getRandomData(PICTURE_NUMBER);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPicture(pictures[i]));
  }
  similarListElement.appendChild(fragment);
};
createFragment();

var ESC_KEYCODE = 27;
var uploadFile = document.querySelector('.img-upload__input');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadClosed = document.querySelector('.img-upload__cancel');

// Закрытие нажатием ESC
var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeOverlay();
  }
};

// Открытие формы для редактирования фото
var openOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onEscPress);
};

uploadFile.addEventListener('change', openOverlay);

// Закрытие формы для редактирования фото
var closeOverlay = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onEscPress);
};

uploadClosed.addEventListener('click', function () {
  closeOverlay();
});

// Масштабирование
var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');
var scaleControlNumber = parseInt(scaleControlValue.value, 10);
var imgUploadPreview = document.querySelector('.img-upload__preview');
var scaleValue = {
  MIN: 25,
  MAX: 100,
  STEP: 25
};

scaleControlBigger.addEventListener('click', function () {
  if (scaleControlNumber < scaleValue.MAX) {
    scaleControlNumber += scaleValue.STEP;
    scaleControlValue.value = scaleControlNumber + '%';
    imgUploadPreview.querySelector('img').style.transform = 'scale(' + (scaleControlNumber / 100) + ')';
  }
});

scaleControlSmaller.addEventListener('click', function () {
  if (scaleControlNumber > scaleValue.MIN) {
    scaleControlNumber -= scaleValue.STEP;
    scaleControlValue.value = scaleControlNumber + '%';
    imgUploadPreview.querySelector('img').style.transform = 'scale(' + (scaleControlNumber / 100) + ')';
  }
});

// Эффекты
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
  var previewPicture = imgUploadPreview.querySelector('img');
  previewPicture .style.filter = currentEffect.effectName + '(' + currentEffect.max + currentEffect.points + ')';
  imgUploadPreview.classList = 'img-upload__preview';
  previewPicture.classList.add(currentEffect.class);
});

// Хештеги
var MAX_HASHTAGS = 5;
var MAX_HASHTAG_LENGTH = 20;
var textHashtags = document.querySelector('.text__hashtags');

var checkHashtags = function (userInput) {
  if (userInput === '') {
    return '';
  }

  var hashtags = userInput.toLowerCase().split(' ');

  if (hashtags.length > MAX_HASHTAGS) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  for (var i = 0; i < hashtags.length; i++) {
    var hashtag = hashtags[i];

    if (hashtag[0] !== '#') {
      return 'Хэштег должен начинаться с символа #';
    }

    if (hashtag === '#') {
      return 'Хештег не может состоять только из одной #';
    }

    var cutHashtag = hashtag.slice(1);

    if (cutHashtag.indexOf('#') !== -1) {
      return 'Хэштеги разделяются пробелами';
    }

    if (hashtags.indexOf(hashtag) !== i) {
      return 'Oдин и тот же хэштег не может быть использован дважды';
    }

    if (hashtag.length > MAX_HASHTAG_LENGTH) {
      return 'Максимальная длина одного хэштега 20 символов';
    }
  }

  return '';
};

textHashtags.addEventListener('change', function () {
  var hashtagError = checkHashtags(textHashtags.value);
  textHashtags.setCustomValidity(hashtagError);
});

textHashtags.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEscPress);
});

textHashtags.addEventListener('blur', function () {
  document.addEventListener('keydown', onEscPress);
  checkHashtags(textHashtags);
});

// Комментарии
var textDescription = document.querySelector('.text__description');
textDescription.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEscPress);
});
