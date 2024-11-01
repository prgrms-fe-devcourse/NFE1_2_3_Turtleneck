'use client';

import React, { useState } from 'react';
import styles from './LikeButton.module.scss';

const LikeButton = () => {
  // 좋아요 상태와 좋아요 수 관리
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 좋아요 버튼 클릭 핸들러
  const handleLikeToggle = () => {
    // 좋아요 상태 반전
    setIsLiked(!isLiked);
    // 좋아요 수 증가 또는 감소
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  return (
    <div className={styles.like_button_container}>
      <button className={styles.like_button} onClick={handleLikeToggle}>
        {/* 빈 하트(좋아요 안 함)와 색 찬 하트(좋아요 함) 조건부 렌더링 */}
        {isLiked ? (
          <span className={styles.materialIconLikeTrue}>favorite</span>
        ) : (
          <span className={styles.materialIconLikeFalse}>favorite</span>
        )}
      </button>
      {/* 좋아요 수 표시 */}
      <span className={styles.like_count}>{likeCount}</span>
    </div>
  );
};

export default LikeButton;
