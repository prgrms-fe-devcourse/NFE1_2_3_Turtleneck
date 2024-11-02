import dbConnect from '../../../db/dbConnect'; // 상대 경로 수정
import Auth from '../../../db/models/auth'; // Auth 모델도 같은 위치일 것으로 가정
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    await dbConnect();

    const { id, password } = await request.json();

    const user = await Auth.findOne({ id });
    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 아이디입니다' },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다' },
        { status: 401 },
      );
    }

    const userInfo = {
      id: user.id,
      nickname: user.nickname,
      blogTitle: user.blogTitle,
      blogInfo: user.blogInfo,
    };

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}
