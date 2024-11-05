// app/api/upload/route.js

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Next.js의 기본 bodyParser 비활성화
export const config = {
  api: {
    bodyParser: false,
  },
};

// 업로드 폴더 설정
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// 업로드 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 파일을 저장하는 함수
async function saveFile(fileBlob, clientFileName) {
  // 파일의 ArrayBuffer를 읽어서 Buffer로 변환
  const arrayBuffer = await fileBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 파일 저장 경로 및 이름 설정
  const extension = path.extname(clientFileName) || '.png'; // 확장자가 없을 시 기본값 설정
  const filename = `${Date.now()}-uploadedfile${extension}`;
  const filepath = path.join(uploadDir, filename);

  // 파일을 저장
  fs.writeFileSync(filepath, buffer);
  return filename;
}

// POST 요청 처리
export async function POST(req) {
  const formData = await req.formData(); // Next.js에서 `formData()` 사용 가능
  const fileBlob = formData.get('file'); // 파일 Blob 객체 가져오기
  const clientFileName = formData.get('filename');
  try {
    if (!fileBlob || !clientFileName) {
      return NextResponse.json(
        { message: 'No file or filename provided' },
        { status: 400 },
      );
    }
    // 파일 저장
    const filename = await saveFile(fileBlob, clientFileName);

    // 업로드된 파일의 URL 반환
    const fileUrl = `http://localhost:3005/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { message: 'File upload failed' },
      { status: 500 },
    );
  }
}
