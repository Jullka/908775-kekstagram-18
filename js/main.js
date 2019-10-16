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
var LIKES_MIN_NUMBER = 15;
var LIKES_MAX_NUMBER = 200;
var PICTURE_NUMBER = 25;
var AVATAR_MIN_NUMBER = 1;
var AVATAR_MAX_NUMBER = 6;

var randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomData = function () {
  var randomPicture = [];
  for (var i = 1; i <= PICTURE_NUMBER; i++) {
    randomPicture.push({
      url: 'photos/' + i + '.jpg',
      description: 'Описание фото',
      likes: randomInt(LIKES_MIN_NUMBER, LIKES_MAX_NUMBER),
      comments: getRandomComment(randomInt(0, 5))
    });
  }
  return randomPicture;
};

var getRandomComment = function (countOfComments) {
  var comments = [];
  for (var i = 0; i < countOfComments; i++) {
    comments.push({
      avatar: 'img/avatar-' + randomInt(AVATAR_MIN_NUMBER, AVATAR_MAX_NUMBER) + '.svg',
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

var pictures = getRandomData(PICTURE_NUMBER);

var renderPicture = function (picture) {
  var pictureElement = similarPictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < pictures.length; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}
similarListElement.appendChild(fragment);

