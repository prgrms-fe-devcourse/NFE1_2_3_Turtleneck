import React from 'react';
import MarkdownIt from 'markdown-it';
import styles from './post.module.scss';
import CommentSection from './components/comments';

// MarkdownIt 인스턴스 생성 (마크다운 렌더링에 사용)
const md = new MarkdownIt();

// 페이지 컴포넌트
const page = () => {
  // 메타데이터 태그를 확인하기 위한 더미 태그 문자열. 쉼표로 구분
  const dummyTags = "#프론트엔드,#React,#Next.js";
  
  return (
    <div className={styles.post_container}>
      {/* 헤더 섹션: 페이지 상단에 뒤로가기 버튼과 포스트 제목 */}
      <header className={styles.header_section}>
        <button className={styles.btn_back}>
          <span className={styles.materialIcon}>arrow_back</span>
        </button>
        <h1 className={styles.post_title}>
          React와 Next.js로 만드는 마크다운 블로그
        </h1>
      </header>

      {/* 사이드바 섹션: 메타데이터와 목차 */}
      {/* 메타데이터 섹션: 게시글의 날짜, 카테고리, 태그, 공유 버튼을 제공*/}
      <aside className={styles.aside_section}>
        <div className={styles.metadata_section}>
          <div className={styles.section_name}>/ METADATA</div>
          <table>
            <tbody>
              {/* 포스트 날짜 */}
              <tr>
                <th className={styles.metadata_label}>DATE</th>
                <td className={styles.metadata_value}>2024.10.20</td>
              </tr>
              {/* 카테고리 정보 */}
              <tr>
                <th className={styles.metadata_label}>CATEGORY</th>
                <td className={styles.metadata_value}>Turtleneck</td>
              </tr>
              {/* 태그 정보 */}
              <tr>
                <th className={styles.metadata_label}>TAGS</th>
                <td className={styles.metadata_value}>
                  {/* 쉼표로 구분된 태그 */}
                  {dummyTags.split(",").map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag.trim()}
                    </span>
                  ))}
                </td>
              </tr>
              {/* 링크 복사 버튼 */}
              <tr>
                <th className={styles.metadata_label}>SHARE</th>
                <td className={styles.metadata_value}></td>
              </tr>
            </tbody>
          </table>
          <button className={styles.btn_share_copy}>
            <span className={styles.materialIcon}>content_copy</span>COPY LINK
          </button>
        </div>

        {/* 목차 섹션: 포스트 내부의 헤딩 목록을 보여줌 */}
        <div className={styles.toc_section}>
          <div className={styles.section_name}>/ TABLE OF CONTENTS</div>
          <ol className={styles.toc_list}>
            <li className={styles.toc_item}>예시 헤딩 1</li>
            <li className={styles.toc_item}>예시 헤딩 2</li>
            <li className={styles.toc_item}>예시 헤딩 3</li>
          </ol>
        </div>
      </aside>

      {/* 본문 섹션 */}
      <div className={styles.article_section}>
        {/* 본문 헤더: 아티클 레이블과 편집/삭제 버튼 */}
        <div className={styles.article_header}>
          <div className={styles.section_name}>/ ARTICLE</div>
          <div className={styles.article_btns}>
            <button className={styles.btn_edit}>EDIT</button>
            <button className={styles.btn_delete}>DELETE</button>
          </div>
        </div>

        {/* 아티클 내용: 마크다운으로 작성된 본문이 렌더링될 영역 */}
        <article className={styles.article_content}>
          {/* 더미 마크다운 문서 렌더링 */}
        </article>
      </div>

      {/* 댓글 섹션 */}
      <CommentSection />
    </div>
  );
};

export default page;
