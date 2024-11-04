"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;
exports.POST = POST;

var _server = require("next/server");

var _dbConnect = _interopRequireDefault(require("@/app/db/dbConnect"));

var _post = _interopRequireDefault(require("@/app/db/models/post"));

var _category = _interopRequireDefault(require("@/app/db/models/category"));

var _like = _interopRequireDefault(require("@/app/db/models/like"));

var _comment = _interopRequireDefault(require("@/app/db/models/comment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function GET() {
  var posts;
  return regeneratorRuntime.async(function GET$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _dbConnect["default"])());

        case 2:
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(_post["default"].find().populate('categoryId', 'name').populate('likes').populate('comments'));

        case 5:
          posts = _context.sent;
          return _context.abrupt("return", _server.NextResponse.json(posts));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](2);
          console.error('Error fetch posts:', _context.t0);
          return _context.abrupt("return", _server.NextResponse.json({
            message: '게시글 리스트 조회 실패'
          }, {
            status: 500
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 9]]);
}

function POST(req) {
  var formData, title, content, categoryId, mainImage, tags, newPost;
  return regeneratorRuntime.async(function POST$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap((0, _dbConnect["default"])());

        case 2:
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(req.formData());

        case 5:
          formData = _context2.sent;
          title = formData.get('title');
          content = formData.get('content');
          categoryId = formData.get('categoryId');
          mainImage = formData.get('mainImage');
          tags = formData.get('tags');
          _context2.next = 13;
          return regeneratorRuntime.awrap(_post["default"].create({
            title: title,
            content: content,
            mainImage: mainImage,
            categoryId: categoryId,
            tags: tags // 태그 ID 배열 사용

          }));

        case 13:
          newPost = _context2.sent;
          return _context2.abrupt("return", _server.NextResponse.json(newPost));

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](2);
          console.error('Error creating post:', _context2.t0);
          return _context2.abrupt("return", _server.NextResponse.json({
            message: '게시글 생성 실패'
          }, {
            status: 500
          }));

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 17]]);
}