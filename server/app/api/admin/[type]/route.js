import dbConnect from '@/app/db/dbConnect';
import Auth from '@/app/db/models/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  await dbConnect();
  try {
    const { pathname } = req.nextUrl;
    const type = pathname.split('/').pop(); // nickname, blogTitle, blogInfo만 처리
    const updateData = await req.json();

    // 관리자 설정 업데이트
    const updatedAdmin = await Auth.findOneAndUpdate(
      {},
      { [type]: updateData[type] },
      { new: true, select: '-password' },
    );
    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Error update:', error);
    return NextResponse.json({ message: '업데이트 실패' }, { status: 500 });
  }
}
