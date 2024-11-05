import { NextResponse } from 'next/server'; // Next.js의 서버 사이드 응답을 위한 NextResponse 사용
import formidable from 'formidable'; // 파일 업로드를 처리하기 위한 formidable 모듈
import path from 'path'; // 파일 및 디렉터리 경로 작업을 위한 path 모듈
import fs from 'fs'; // 파일 시스템을 조작하기 위한 fs 모듈 (비동기식 fs.promises 사용)

export const config = {
  // Next.js API 라우트에서 기본적으로 bodyParser가 활성화되어 있는데,
  // 파일을 직접 다루기 때문에 bodyParser를 비활성화
  api: {
    bodyParser: false,
  },
};

// API 요청을 처리하는 함수
export default async function handler(req, res) {
  // 저장할 디렉터리 경로 설정. 여기서는 public/images에 이미지를 저장
  const imgStoragePath = path.join(process.cwd(), '/public/images');

  // 이미지 파일을 저장할 폴더가 없으면 생성하도록 처리
  try {
    // 지정된 경로에 해당 폴더가 존재하는지 확인
    await fs.readdir(imgStoragePath);
  } catch {
    // 폴더가 없으면 새로 생성
    await fs.mkdir(imgStoragePath);
  }

  // 파일을 로컬에 저장하는 함수
  // saveLocally: true일 경우 로컬에 저장하도록 설정
  const readFile = (req, saveLocally = true) => {
    // formidable 옵션 객체
    const options = {};

    // 로컬에 저장할 경우, 업로드 경로 및 파일명 설정
    if (saveLocally) {
      // 업로드 디렉터리 설정 (public/images 경로)
      options.uploadDir = imgStoragePath;

      // 파일명 설정: 현재 시간을 기반으로 파일명 설정 (중복을 피하기 위해)
      options.filename = (name, ext, path, form) => {
        return Date.now().toString() + '_' + path.originalFilename;
      };
    }

    // Promise를 반환하는 파일 파싱 함수
    return new Promise((resolve, reject) => {
      // formidable 폼 파서 생성, 파일을 처리할 때 사용
      const form = formidable(options);

      // 폼 데이터 파싱: 파일과 필드를 추출
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err); // 에러 발생 시 reject
        }
        console.log(fields); // 콘솔에 필드 데이터 출력 (일반적인 텍스트 필드)
        resolve({ fields, files }); // 필드와 파일 데이터를 반환
      });
    });
  };

  // 요청을 처리하고 파일 업로드를 수행
  const data = await readFile(req, true); // saveLocally: true로 설정하여 로컬에 저장

  // 업로드된 파일의 정보를 콘솔에 출력
  // data.files.img: img는 클라이언트에서 보내온 파일의 필드명
  console.log(data.files.img); // 업로드된 파일 (Blob 형태)

  // 추가로 받은 필드 정보 (base64 형식 이미지나 텍스트 데이터 등)
  console.log(data.fields.imgToBase64); // base64 인코딩된 이미지 (폼에서 받은 경우)

  // `newFilename`을 통해 저장된 파일의 이름을 가져올 수 있습니다
  const savedImage = data.files.img; // 업로드된 이미지 파일 객체
  const savedFileName = savedImage.newFilename; // `newFilename` 속성에서 고유 파일명 추출

  // 파일 저장 후, 파일의 경로(URL)를 생성
  const imageUrl = `/images/${savedFileName}`; // URL 형식으로 이미지 경로 생성

  // 클라이언트에게 성공적인 응답을 반환
  // JSON 형식으로 상태 메시지 반환
  return res.status(201).json({ message: 'OK', imageUrl: imageUrl });
}
