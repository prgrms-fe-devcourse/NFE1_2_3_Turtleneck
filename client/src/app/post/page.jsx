import React from 'react';
import MarkdownIt from 'markdown-it';
import styles from './post.module.scss';

const md = new MarkdownIt();

const page = () => {
  return (
    <div className={styles.post_container}>
      <header className={styles.header_section}>
        <button className={styles.btn_back}>[B] BACK</button>
        <h1 className={styles.post_title}>
          React와 Next.js로 만드는 마크다운 블로그
        </h1>
      </header>

      <aside className={styles.aside_section}>
        <div className={styles.metadata_section}>
          <div className={styles.section_name}>/ METADATA</div>
          <table>
            <tbody>
              <tr>
                <th className={styles.metadata_label}>DATE</th>
                <td className={styles.metadata_value}>2024.10.20</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>CATEGOTY</th>
                <td className={styles.metadata_value}>Turtleneck</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>TAGS</th>
                <td className={styles.metadata_value}>#프론트엔드</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>SHARE</th>
                <td className={styles.metadata_value}></td>
              </tr>
            </tbody>
          </table>
          <button className={styles.btn_share_copy}>COPY LINK</button>
        </div>
        <div className={styles.toc_section}>
          <div className={styles.section_name}>/ TABLE OF CONTENTS</div>
          <ol className={styles.toc_list}>
            <li className={styles.toc_item}>예시 헤딩 1</li>
            <li className={styles.toc_item}>예시 헤딩 2</li>
            <li className={styles.toc_item}>예시 헤딩 3</li>
          </ol>
        </div>
      </aside>

      <div className={styles.article_section}>
        <div className={styles.article_header}>
          <div className={styles.section_name}>/ ARTICLE</div>
          <div className={styles.article_btns}>
            <button className={styles.btn_edit}>EDIT</button>
            <button className={styles.btn_delete}>DELETE</button>
          </div>
        </div>
        <article className={styles.article_content}>
          {/* 더미 마크다운 문서 렌더링 */}
        </article>
      </div>

      <div className={styles.comments_section}>
        <div className={styles.comment_form_header}>
          <div className={styles.section_name}>/ COMMENTS</div>
          {/* <button className={styles.btn_post_like}>POST LIKE</button> */}
        </div>
        <div className={styles.comment_form}>
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
          <textarea
            type="text"
            className={styles.input_comment_text}
            placeholder="WRITE YOUR COMMNET HERE"
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
                <button className={styles.btn_edit}>EDIT</button>
                <button className={styles.btn_delete}>DELETE</button>
              </div>
            </div>
            <p className={styles.comment_content}>
              좋은 정보 감사합니다. 덕분에 많은 도움이 되었습니다.
            </p>
            <p className={styles.comment_date}>2025.10.20 00:00</p>
          </li>
        </div>
      </div>
    </div>
  );
};

export default page;
