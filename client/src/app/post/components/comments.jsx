'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './CommentSection.module.scss';
import { commentApi } from '@/utils/api';

export default function Comments({ postId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const [newComment, setNewComment] = useState({
    content: '',
    nickname: '',
    password: '',
  });

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentApi.getComments(postId);
        setComments(data);
      } catch (error) {
        console.error('댓글 로딩 실패:', error);
      }
    };

    fetchComments();
  }, [postId]);

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

  // 댓글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const commentData = session
        ? {
            postId,
            content: newComment.content,
            isAdmin: true,
            nickname: session.user.nickname,
            password: null,
          }
        : {
            postId,
            content: newComment.content,
            isAdmin: false,
            nickname: newComment.nickname,
            password: newComment.password,
          };

      await commentApi.createComment(commentData);

      setNewComment({
        content: '',
        nickname: '',
        password: '',
      });

      // 댓글 목록 새로고침
      const updatedData = await commentApi.getComments(postId);
      setComments(updatedData);
    } catch (error) {
      alert(error.message);
    }
  };

  // 권한 확인 및 작업 처리
  const handleAction = async (comment, type) => {
    if (session) {
      // 관리자 로그인 상태
      if (comment.isAdmin) {
        // 관리자 댓글인 경우
        if (type === 'edit') {
          // 수정은 자신의 댓글만
          setIsEditing(comment._id);
          setEditContent(comment.content);
        } else if (type === 'delete') {
          // 삭제는 모든 댓글 가능
          await handleDelete(comment._id, null, true);
        }
      } else {
        // 일반 댓글인 경우 - 관리자는 삭제만 가능
        if (type === 'delete') {
          await handleDelete(comment._id, null, true);
        }
      }
    } else {
      // 비로그인 상태 - 자신의 일반 댓글만 수정/삭제 가능
      if (!comment.isAdmin) {
        // 관리자 댓글이 아닌 경우에만
        openPasswordModal(comment._id, type);
      }
    }
  };

  // 비밀번호 확인 모달 열기
  const openPasswordModal = (commentId, type) => {
    setSelectedComment(commentId);
    setActionType(type);
    setShowPasswordModal(true);
    setPasswordInput('');
  };

  // 비밀번호 확인 후 액션 실행
  const handlePasswordSubmit = async () => {
    try {
      if (actionType === 'edit') {
        const comment = comments.find((c) => c._id === selectedComment);
        setIsEditing(selectedComment); // 먼저 수정 모드로 전환
        setEditContent(comment.content); // 내용 설정
        setShowPasswordModal(false); // 모달 닫기
      } else if (actionType === 'delete') {
        await handleDelete(selectedComment, passwordInput);
        setShowPasswordModal(false);
      }
    } catch (error) {
      setPasswordInput('');
      alert(error.message);
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId, password = null) => {
    try {
      // 관리자 로그인 상태와 일반 사용자를 구분
      await commentApi.updateComment(commentId, {
        content: editContent,
        password: password,
        isAdmin: session ? true : false, // 추가: 관리자 여부 전달
      });

      setIsEditing(null);
      // 댓글 목록 새로고침
      const updatedData = await commentApi.getComments(postId);
      setComments(updatedData);
    } catch (error) {
      throw error;
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId, password = null, isAdmin = false) => {
    try {
      await commentApi.deleteComment(commentId, password, isAdmin);
      // 댓글 목록 새로고침
      const updatedData = await commentApi.getComments(postId);
      setComments(updatedData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={styles.comments_section}>
      <div className={styles.section_name}>/ COMMENTS 💬</div>

      <form onSubmit={handleSubmit} className={styles.comment_form}>
        {!session && (
          <div className={styles.commenter_info}>
            <input
              type="text"
              placeholder="글쓴이"
              className={styles.input_nickname}
              value={newComment.nickname}
              onChange={(e) =>
                setNewComment((prev) => ({
                  ...prev,
                  nickname: e.target.value,
                }))
              }
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              className={styles.input_password}
              value={newComment.password}
              onChange={(e) =>
                setNewComment((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              required
            />
          </div>
        )}
        <textarea
          placeholder="댓글을 작성하세요."
          className={styles.input_comment_text}
          value={newComment.content}
          onChange={(e) =>
            setNewComment((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
          required
        />
        <button type="submit" className={styles.btn_submit}>
          등록
        </button>
      </form>

      <div className={styles.comments_list}>
        {comments.map((comment) => (
          <div key={comment._id} className={styles.comment_item}>
            <div className={styles.comment_header}>
              <div className={styles.comment_nickname}>{comment.nickname}</div>
              {isEditing === comment._id ? (
                <div className={styles.comment_actions}>
                  <button
                    className={styles.btn_save}
                    onClick={() => handleEdit(comment._id)}
                  >
                    수정하기
                  </button>
                  <button
                    className={styles.btn_cancel}
                    onClick={() => setIsEditing(null)}
                  >
                    취소
                  </button>
                </div>
              ) : // 수정/삭제 버튼 표시 조건
              (session && comment.isAdmin) ||
                (!session && !comment.isAdmin) ||
                (session && !comment.isAdmin) ? (
                <div className={styles.comment_actions}>
                  <button
                    className={styles.action_button}
                    onClick={() => setShowActionMenu(comment._id)}
                  >
                    ⚙️
                  </button>
                  {showActionMenu === comment._id && (
                    <div className={styles.action_menu}>
                      {/* 수정 버튼은 관리자의 경우 자신의 글만, 비로그인은 자신의 일반 글만 */}
                      {((session && comment.isAdmin) ||
                        (!session && !comment.isAdmin)) && (
                        <button onClick={() => handleAction(comment, 'edit')}>
                          수정
                        </button>
                      )}
                      {/* 삭제 버튼은 관리자는 모든 글, 비로그인은 자신의 일반 글만 */}
                      {(session || (!session && !comment.isAdmin)) && (
                        <button onClick={() => handleAction(comment, 'delete')}>
                          삭제
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            {isEditing === comment._id ? (
              <div className={styles.edit_form}>
                <textarea
                  className={styles.input_comment_text}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <p className={styles.comment_content}>{comment.content}</p>
                <p className={styles.comment_date}>
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showPasswordModal && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <h3>비밀번호 확인</h3>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
            <div className={styles.modal_buttons}>
              <button onClick={handlePasswordSubmit}>확인</button>
              <button onClick={() => setShowPasswordModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
