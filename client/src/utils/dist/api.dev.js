"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postApi = exports.categoryApi = exports.authApi = exports.fetchApi = void 0;

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
}; // 로그인


exports.fetchApi = fetchApi;
var authApi = {
  login: function login(id, password) {
    return regeneratorRuntime.async(function login$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", fetchApi('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify({
                id: id,
                password: password
              })
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
}; //카테고리 리스즈

exports.authApi = authApi;
var categoryApi = {
  getCategories: function getCategories() {
    return regeneratorRuntime.async(function getCategories$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", fetchApi('/api/category', {
              method: 'GET'
            }));

          case 1:
          case "end":
            return _context3.stop();
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
        _args4 = arguments;
    return regeneratorRuntime.async(function getRecentPosts$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            limit = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 2;
            return _context4.abrupt("return", fetchApi("/api/post?limit=".concat(limit)));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  // 모든 게시글 조회
  getAllPosts: function getAllPosts() {
    return regeneratorRuntime.async(function getAllPosts$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", fetchApi('/api/post'));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  // 새 게시글 작성
  createPost: function createPost(_ref) {
    var title, content, mainImage, categoryId, tags;
    return regeneratorRuntime.async(function createPost$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            title = _ref.title, content = _ref.content, mainImage = _ref.mainImage, categoryId = _ref.categoryId, tags = _ref.tags;
            return _context6.abrupt("return", fetchApi('/api/post', {
              method: 'POST',
              body: JSON.stringify({
                title: title,
                content: content,
                mainImage: mainImage,
                categoryId: categoryId,
                tags: tags
              })
            }));

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  // 특정 게시글 조회
  getPost: function getPost(postId) {
    return regeneratorRuntime.async(function getPost$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            return _context7.abrupt("return", fetchApi("/api/post/".concat(postId)));

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  // 게시글 수정
  updatePost: function updatePost(postId, updateData) {
    return regeneratorRuntime.async(function updatePost$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            return _context8.abrupt("return", fetchApi("/api/post/".concat(postId), {
              method: 'PATCH',
              body: JSON.stringify(updateData)
            }));

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  // 게시글 삭제
  deletePost: function deletePost(postId) {
    return regeneratorRuntime.async(function deletePost$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt("return", fetchApi("/api/post/".concat(postId), {
              method: 'DELETE'
            }));

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    });
  }
};
exports.postApi = postApi;