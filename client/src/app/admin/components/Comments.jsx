'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/utils/api';
import { useRouter } from 'next/navigation';
import styles from './Comments.module.scss';

const Comments = () => {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 댓글 목록 조회
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await adminApi.getAllComments();
        setComments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await adminApi.deleteComment(commentId);
      // 삭제 후 목록에서도 제거
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      setError(error.message);
    }
  };

  // 댓글 내용 미리보기 (50자)
  const previewContent = (content) => {
    return content.length > 50 ? content.slice(0, 50) + '...' : content;
  };

  if (isLoading) return <div>로딩중...</div>;

  const handleCommentClick = (postId) => {
    router.push(`/post/${postId}`);
  };

  return (
    <div className={styles.comments}>
      <div className={styles.list_header}>
        <div>DATETIME</div>
        <div>COMMENTER</div>
        <div>COMMENT</div>
      </div>

      {comments.map((comment) => (
        <div
          key={comment._id}
          className={styles.list_item}
          onClick={() => {
            const postId = comment.postId?._id || comment.postId;
            if (postId) {
              router.push(`/post/${postId}`);
            }
          }}
        >
          <div className={styles.datetime}>{formatDate(comment.createdAt)}</div>
          <div className={styles.commenter}>{comment.nickname}</div>
          <div className={styles.comment}>
            {previewContent(comment.content)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(comment._id);
            }}
            className={styles.delete_button}
          >
            DELETE
          </button>
        </div>
      ))}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default Comments;
