import dbConnect from '@/app/db/dbConnect';
import Auth from '@/app/db/models/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    // 관리자 설정만 가져오기 (카테고리 제외)
    const adminSettings = await Auth.findOne({}, { password: 0 });

    return NextResponse.json({
      admin: adminSettings,
    });
  } catch (error) {
    console.error('Error fetch admin data:', error);
    return NextResponse.json(
      { message: '관리자 데이터 조회 실패' },
      { status: 500 },
    );
  }
}
