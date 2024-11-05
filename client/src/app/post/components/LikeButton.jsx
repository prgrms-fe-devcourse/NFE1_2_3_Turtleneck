// LikeButton 컴포넌트 (client/src/app/post/components/LikeButton.jsx)
'use client';

import React, { useState, useEffect } from 'react';
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
  const [latestLikeId, setLatestLikeId] = useState(null);

  useEffect(() => {
    // 최신 likeId 가져오기
    const likeId =
      LikesArray.length > 0 ? LikesArray[LikesArray.length - 1]._id : null;
    setLatestLikeId(likeId);
  }, [LikesArray]);

  const handleLikeToggle = async () => {
    try {
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  
      if (isLiked) {
        await likeApi.removeLike(latestLikeId);
      } else {
        await likeApi.addLike(postId);
      }
  
      // 서버 요청 후 데이터 불러오기
      await updateLikesData();
    } catch (error) {
      console.error('좋아요 상태 변경 오류:', error);
      alert('좋아요 상태를 변경하는 데 실패했습니다. 다시 시도해주세요.');
  
      // 오류 발생 시 UI 상태 원상 복구
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
    }
  };
  
  

  const updateLikesData = async () => {
    try {
      const updatedPost = await postApi.getPost(params.id); // 게시글 데이터를 다시 불러오기
      setPost(updatedPost);
      setIsLikedByUser(updatedPost.isLikedByUser);
    } catch (error) {
      console.error('좋아요 업데이트 후 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
  };



  return (
    <div className={styles.like_button_container}>
      <button className={styles.like_button} onClick={handleLikeToggle}>
        {isLiked ? (
          <span className={styles.materialIconLikeTrue}>favorite</span>
        ) : (
          <span className={styles.materialIconLikeFalse}>favorite_border</span>
        )}
      </button>
      <span className={styles.like_count}>{likeCount}</span>
    </div>
  );
};

export default LikeButton;
