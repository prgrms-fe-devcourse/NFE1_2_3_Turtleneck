// components/CopyLinkButton.js
'use client'; // 클라이언트 컴포넌트로 선언

import React from 'react';
import styles from './CopyLinkButton.module.scss'; // 필요한 스타일 경로 설정

const CopyLinkButton = () => {
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert('링크가 복사되었습니다!');
      })
      .catch((err) => {
        console.error('링크 복사 실패:', err);
      });
  };

  return (
    <button onClick={handleCopyLink} className={styles.btn_share_copy}>
      <span className={styles.materialIcon}>content_copy</span>COPY LINK
    </button>
  );
};

export default CopyLinkButton;
