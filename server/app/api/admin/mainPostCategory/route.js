import dbConnect from '@/app/db/dbConnect';
import Auth from '@/app/db/models/auth';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  await dbConnect();
  try {
    const { mainPostCategoryId } = await req.json();

    const updatedAdmin = await Auth.findOneAndUpdate(
      {},
      { mainPostCategoryId },
      { new: true, select: '-password' },
    );

    return NextResponse.json({ admin: updatedAdmin });
  } catch (error) {
    console.error('Error updating main post category:', error);
    return NextResponse.json(
      { message: '메인 포스트 카테고리 업데이트 실패' },
      { status: 500 },
    );
  }
}
