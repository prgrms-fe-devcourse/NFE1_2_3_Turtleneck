'use client';

import { useState } from 'react';
import styles from './CommentSection.module.scss';

export default function CommentSection() {
  const [isAdmin, setIsAdmin] = useState(true); // Admin 여부 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState('예시 댓글입니다.');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.comments_section}>
      <div className={styles.comment_form_header}>
        <div className={styles.section_name}>/ COMMENTS</div>
      </div>

      <div className={styles.comment_form}>
        {!isAdmin && (
          <div className={styles.commenter_info}>
            <input
              type="text"
              className={styles.input_nickname}
              placeholder="NICKNAME"
            />
            <input
              type="password"
              className={styles.input_password}
              placeholder="PASSWORD"
            />
          </div>
        )}
        <textarea
          type="text"
          className={styles.input_comment_text}
          placeholder="WRITE YOUR COMMENT HERE"
        />
        <div className={styles.submit_wrapper}>
          <button className={styles.btn_submit}>SUBMIT</button>
        </div>
      </div>

      <div className={styles.comments_list}>
        <li className={styles.comment_item}>
          <div className={styles.comment_header}>
            <p className={styles.comment_nickname}>글쓴이 1</p>
            <div className={styles.comment_menu}>
              {isEditing ? (
                <div className={styles.edit_buttons}>
                  <button className={styles.btn_save} onClick={handleSaveClick}>
                    SAVE
                  </button>
                  <button
                    className={styles.btn_cancel}
                    onClick={handleCancelClick}
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <>
                  <button className={styles.btn_edit} onClick={handleEditClick}>
                    EDIT
                  </button>
                  <button className={styles.btn_delete}>DELETE</button>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <div className={styles.edit_form}>
              <textarea
                className={styles.input_comment_text}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <p className={styles.comment_content}>{editComment}</p>
              <p className={styles.comment_date}>2025.10.20 00:00</p>
            </div>
          )}
        </li>
      </div>
    </div>
  );
}
