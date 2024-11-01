import React from 'react';
import MarkdownIt from 'markdown-it';
import styles from './post.module.scss';
import CommentSection from './components/comments';
import CopyLinkButton from './components/CopyLinkButton';
import LikeButton from './components/LikeButton';

// MarkdownIt 인스턴스 생성 (마크다운 렌더링에 사용)
const md = new MarkdownIt();

// 페이지 컴포넌트
const page = () => {
  // 메타데이터 태그를 확인하기 위한 더미 태그 문자열. 쉼표로 구분
  const dummyTags = '#프론트엔드,#React,#Next.js';

  // 마크다운 미리보기를 확인하기 위한 더미 마크다운 텍스트
  const dummyMarkdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

**굵은 텍스트**  
*기울임 텍스트*  
***굵은 기울임 텍스트***  
~~취소선 텍스트~~

---

> 이 부분은 인용문입니다.
> > 중첩된 인용문입니다.

---

1. 순서가 있는 목록 첫 번째 항목
2. 두 번째 항목
    1. 하위 항목
    2. 또 다른 하위 항목

- 순서 없는 목록 첫 번째 항목
- 두 번째 항목
  - 하위 항목
  - 또 다른 하위 항목

---

### 링크와 이미지
[Google로 이동](https://www.google.com)

![Markdown 로고](https://markdown-here.com/img/icon256.png)

---

### 코드 블록

\`\`\`javascript
// JavaScript 코드 예시
function greet(name) {
    return \`Hello, \${name}!\`;
}
console.log(greet("Markdown"));
\`\`\`

---

### 인라인 코드
여기에 \`console.log("Hello, Markdown!");\` 와 같은 인라인 코드를 사용할 수 있습니다.

---

### 테이블

| Feature       | Description                | Status    |
| ------------- | -------------------------- | --------- |
| Heading       | 제목을 지정하는 방법       | 🟢 지원함 |
| Lists         | 순서가 있는 목록과 없는 목록 | 🟢 지원함 |
| Inline Code   | \`코드 스타일\` 지원         | 🟢 지원함 |
| Code Blocks   | 코드 블록 표현              | 🟢 지원함 |

---

### 체크리스트

- [x] 이 항목은 완료됨
- [ ] 이 항목은 아직 미완료

---

### 수평선
위에 내용과 아래 내용을 구분하기 위한 수평선입니다.

---

  `;

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
                  {dummyTags.split(',').map((tag, index) => (
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
          <CopyLinkButton />
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
        <article
          className={styles.article_content}
          dangerouslySetInnerHTML={{ __html: md.render(dummyMarkdown) }}
        >
          {/* 더미 마크다운 문서 렌더링 */}
        </article>
        {/* 좋아요 버튼 섹션 */}
        <LikeButton />
      </div>

      {/* 댓글 섹션 */}
      <CommentSection />
    </div>
  );
};

export default page;
