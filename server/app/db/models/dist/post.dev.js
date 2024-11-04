"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.postSchema = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var postSchema = new _mongoose["default"].Schema({
  categoryId: {
    type: _mongoose["default"].Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mainImage: {
    type: String
  },
  likes: [{
    type: _mongoose["default"].Types.ObjectId,
    // ObjectId로 설정
    ref: 'Like' // Like 모델 참조

  }],
  tags: {
    type: [String],
    required: true
  },
  comments: [{
    type: _mongoose["default"].Types.ObjectId,
    // Comment도 ObjectId로 설정
    ref: 'Comment'
  }]
}, {
  timestamps: true
});
exports.postSchema = postSchema;

var Post = _mongoose["default"].models['Post'] || _mongoose["default"].model('Post', postSchema);

var _default = Post;
exports["default"] = _default;