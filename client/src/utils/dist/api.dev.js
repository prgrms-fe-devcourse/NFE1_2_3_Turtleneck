"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postApi = exports.categoryApi = exports.authApi = exports.fetchApimulti = exports.fetchApi = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// api.js
var BASE_URL = 'http://localhost:3005';

var fetchApi = function fetchApi(endpoint) {
  var options,
      response,
      data,
      _args = arguments;
  return regeneratorRuntime.async(function fetchApi$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("".concat(BASE_URL).concat(endpoint), _objectSpread({}, options, {
            headers: _objectSpread({
              'Content-Type': 'application/json'
            }, options.headers),
            credentials: 'include'
          })));

        case 4:
          response = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          data = _context.sent;

          if (response.ok) {
            _context.next = 10;
            break;
          }

          throw new Error(data.error || '요청 처리 중 오류가 발생했습니다');

        case 10:
          return _context.abrupt("return", data);

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          throw _context.t0;

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

exports.fetchApi = fetchApi;

var fetchApimulti = function fetchApimulti(endpoint) {
  var options,
      response,
      data,
      _args2 = arguments;
  return regeneratorRuntime.async(function fetchApimulti$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(fetch("".concat(BASE_URL).concat(endpoint), _objectSpread({}, options, {
            credentials: 'include'
          })));

        case 4:
          response = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(response.json());

        case 7:
          data = _context2.sent;

          if (response.ok) {
            _context2.next = 10;
            break;
          }

          throw new Error(data.error || '요청 처리 중 오류가 발생했습니다');

        case 10:
          return _context2.abrupt("return", data);

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](1);
          throw _context2.t0;

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 13]]);
}; // 로그인


exports.fetchApimulti = fetchApimulti;
var authApi = {
  login: function login(id, password) {
    return regeneratorRuntime.async(function login$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", fetchApi('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify({
                id: id,
                password: password
              })
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
}; //카테고리 리스트

exports.authApi = authApi;
var categoryApi = {
  getCategories: function getCategories() {
    return regeneratorRuntime.async(function getCategories$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", fetchApi('/api/category', {
              method: 'GET'
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    });
  }
};
exports.categoryApi = categoryApi;
var postApi = {
  // 최신 게시글 조회
  getRecentPosts: function getRecentPosts() {
    var limit,
        _args5 = arguments;
    return regeneratorRuntime.async(function getRecentPosts$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            limit = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : 2;
            return _context5.abrupt("return", fetchApi("/api/post?limit=".concat(limit)));

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  // 모든 게시글 조회
  getAllPosts: function getAllPosts() {
    return regeneratorRuntime.async(function getAllPosts$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", fetchApi('/api/post'));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  // 새 게시글 작성
  createPost: function createPost(_ref) {
    var categoryId, title, tags, content, mainImage, formData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, key, value;

    return regeneratorRuntime.async(function createPost$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            categoryId = _ref.categoryId, title = _ref.title, tags = _ref.tags, content = _ref.content, mainImage = _ref.mainImage;
            formData = new FormData();
            formData.append('categoryId', categoryId);
            formData.append('title', title);
            tags.forEach(function (tag) {
              return formData.append('tags', tag);
            });
            formData.append('content', content);
            formData.append('file', mainImage);

            if (mainImage) {
              formData.append('mainImage', mainImage);
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context7.prev = 11;

            for (_iterator = formData.entries()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              _step$value = _slicedToArray(_step.value, 2), key = _step$value[0], value = _step$value[1];
              console.log(key, value);
            }

            _context7.next = 19;
            break;

          case 15:
            _context7.prev = 15;
            _context7.t0 = _context7["catch"](11);
            _didIteratorError = true;
            _iteratorError = _context7.t0;

          case 19:
            _context7.prev = 19;
            _context7.prev = 20;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 22:
            _context7.prev = 22;

            if (!_didIteratorError) {
              _context7.next = 25;
              break;
            }

            throw _iteratorError;

          case 25:
            return _context7.finish(22);

          case 26:
            return _context7.finish(19);

          case 27:
            return _context7.abrupt("return", fetchApimulti('/api/post', {
              method: 'POST',
              body: formData // FormData 사용

            }));

          case 28:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[11, 15, 19, 27], [20,, 22, 26]]);
  },
  // 특정 게시글 조회
  getPost: function getPost(postId) {
    return regeneratorRuntime.async(function getPost$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", fetchApi("/api/post/".concat(postId)));

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  // 게시글 수정
  updatePost: function updatePost(postId, updateData) {
    return regeneratorRuntime.async(function updatePost$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt("return", fetchApi("/api/post/".concat(postId), {
              method: 'PATCH',
              body: JSON.stringify(updateData)
            }));

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    });
  },
  // 게시글 삭제
  deletePost: function deletePost(postId) {
    return regeneratorRuntime.async(function deletePost$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            return _context10.abrupt("return", fetchApi("/api/post/".concat(postId), {
              method: 'DELETE'
            }));

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    });
  }
};
exports.postApi = postApi;