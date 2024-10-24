const mongoose = require("mongoose");

mongoose
  .connect("your_mongodb_atlas_uri")
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 에러:", err));
