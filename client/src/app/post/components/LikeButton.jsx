'use client';

import React, { useState } from 'react';
import styles from './LikeButton.module.scss';
import { likeApi } from '@/utils/api';

const LikeButton = ({
  postId,
  initialLikeCount,
  initialIsLiked,
  LikesArray,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // 최신 likeId 가져오기
  const latestLikeId = LikesArray[LikesArray.length - 1]?._id;

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        if (latestLikeId) {
          console.log('좋아요 취소 요청:', latestLikeId);
          await likeApi.removeLike(latestLikeId); // 최신 likeId를 삭제 요청에 전달
        }
      } else {
        console.log('좋아요 추가 요청:', postId);
        const response = await likeApi.addLike(postId);
      }
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error('좋아요 상태를 변경하는 데 실패했습니다:', error);
    }
  };

  return (
    <div className={styles.like_button_container}>
      <button className={styles.like_button} onClick={handleLikeToggle}>
        {isLiked ? (
          <span className={styles.materialIconLikeTrue}>favorite</span>
        ) : (
          <span className={styles.materialIconLikeFalse}>favorite</span>
        )}
      </button>
      <span className={styles.like_count}>{likeCount}</span>
    </div>
  );
};

export default LikeButton;
