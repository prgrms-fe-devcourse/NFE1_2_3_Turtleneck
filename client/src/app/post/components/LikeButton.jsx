'use client';

import React, { useState, useEffect } from 'react';
import styles from './LikeButton.module.scss';
import { likeApi } from '@/utils/api';

const LikeButton = ({
  postId, // 게시글 ID (좋아요 추가/삭제 시 사용)
  initialLikeCount, // 초기 좋아요 수
  initialIsLiked, // 사용자가 좋아요를 눌렀는지 여부
  LikesArray, // 좋아요 목록 배열
  onLikeUpdate, // 좋아요 상태 업데이트 콜백 함수
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked); // 현재 좋아요 상태 관리
  const [likeCount, setLikeCount] = useState(initialLikeCount); // 현재 좋아요 수 관리
  const [latestLikeId, setLatestLikeId] = useState(null); // 최신 좋아요 ID 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리 (중복 클릭 방지)

  useEffect(() => {
    // 최신 likeId 가져오기
    const likeId =
      LikesArray.length > 0 ? LikesArray[LikesArray.length - 1]._id : null;
    setLatestLikeId(likeId); // 최신 좋아요 ID 설정
  }, [LikesArray]);

  useEffect(() => {
    setIsLiked(initialIsLiked); // initialIsLiked 값이 변경될 때 isLiked 상태 업데이트
  }, [initialIsLiked]);

  const handleLikeToggle = async () => {
    if (isLoading) return; // 로딩 중일 때 함수 실행 중단 (중복 클릭 방지)

    setIsLoading(true); // 로딩 시작
    try {
      setIsLiked(!isLiked); // 좋아요 상태 토글
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1)); // 좋아요 수 업데이트

      if (isLiked) {
        // 이미 좋아요 상태인 경우 좋아요 취소 요청
        await likeApi.removeLike(latestLikeId);
      } else {
        // 좋아요 상태가 아닌 경우 좋아요 추가 요청
        const response = await likeApi.addLike(postId);
        setLatestLikeId(response._id); // 새로 생성된 좋아요 ID 업데이트
      }

      if (onLikeUpdate) {
        await onLikeUpdate(); // 부모 컴포넌트의 좋아요 상태 업데이트 호출
      }
    } catch (error) {
      console.error('좋아요 상태 변경 오류:', error); // 오류 콘솔 출력
      alert('좋아요 상태를 변경하는 데 실패했습니다. 다시 시도해주세요.'); // 오류 발생 시 사용자에게 알림
      setIsLiked((prev) => !prev); // 오류 발생 시 좋아요 상태 원상 복구
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1)); // 오류 발생 시 좋아요 수 원상 복구
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className={styles.like_button_container}>
      <button
        className={styles.like_button}
        onClick={handleLikeToggle}
        disabled={isLoading} // 로딩 중일 때 버튼 비활성화
      >
        {isLiked ? (
          <span>❤️</span> // 좋아요 상태인 경우 아이콘 변경
        ) : (
          <span>🩶</span> // 좋아요 상태가 아닌 경우 아이콘 변경
        )}
      </button>
      <span className={styles.like_count}>{likeCount}</span> {/* 현재 좋아요 수 표시 */}
    </div>
  );
};

export default LikeButton;
