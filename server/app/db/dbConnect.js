import mongoose from 'mongoose';

// MongoDB 연결 주소 가져오기
const MONGODB_URI = process.env.MONGODB_URI;

// 연결 주소 없으면 에러
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI를 .env 파일에 정의해주세요');
}

// mongoose 연결 상태 저장용 변수
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// DB 연결 함수
async function dbConnect() {
  // 이미 연결되어 있으면 그대로 사용
  if (cached.conn) {
    return cached.conn;
  }

  // 새로운 연결 시도
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // 연결 완료 대기
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
