'use client'; // 클라이언트 컴포넌트로 선언

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
});
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

// 이미지 업로드 핸들러: File 객체를 Data URI로 변환
function onImageUpload(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (data) => {
      resolve(data.target.result); // Data URI 반환
    };
    reader.readAsDataURL(file);
  });
}

function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}

const MarkdownEditor = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <MdEditor
      style={{ height: '500px' }}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
      onImageUpload={onImageUpload} // 이미지 업로드 핸들러 추가
    />
  );
};

export default MarkdownEditor;
