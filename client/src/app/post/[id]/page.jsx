'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { postApi } from '@/utils/api';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import mdHighlightjs from 'markdown-it-highlightjs';
import mdCheckbox from 'markdown-it-task-lists';
import 'highlight.js/styles/github.css';
import styles from './post.module.scss';
import CopyLinkButton from '../components/CopyLinkButton';
import LikeButton from '../components/LikeButton';
import Navigation from '@/app/components/navigation';
import { useSession } from 'next-auth/react';
import Comments from '../components/comments';
import Footer from '@/app/components/Footer';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

// 필요한 언어 등록 (예: JavaScript, Python 등)
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));

// MarkdownIt 인스턴스 생성 및 하이라이팅 플러그인 설정
const md = new MarkdownIt();
md.use(mdHighlightjs, { auto: true, hljs }); // auto 옵션을 통해 언어 자동 감지
md.use(mdCheckbox, { enabled: true, label: true, labelAfter: true });

// 마크다운 텍스트를 받아서 목차와 앵커를 생성하는 함수
async function generateTableOfContents(content) {
  const htmlContent = await remark().use(remarkHtml).process(content);
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent.toString(), 'text/html');
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  const ids = {};

  return headings.map((heading) => {
    const text = heading.textContent?.trim() || '';

    // 한국어 제목 처리
    let id = text
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ-]/g, '')
      .toLowerCase();

    // 중복된 ID 처리
    if (ids[id]) {
      id += `-${ids[id]}`;
      ids[id]++;
    } else {
      ids[id] = 1;
    }

    return {
      id,
      text,
      level: parseInt(heading.tagName.slice(1)), // 헤딩 레벨 추출 (예: H1 -> 1)
    };
  });
}

// 헤딩에 ID 적용 함수
function applyHeadingIds(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  const ids = {};

  headings.forEach((heading) => {
    const text = heading.textContent?.trim() || '';

    // 한국어 제목 처리
    let id = text
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ-]/g, '')
      .toLowerCase();

    // 중복된 ID 처리
    if (ids[id]) {
      id += `-${ids[id]}`;
      ids[id]++;
    } else {
      ids[id] = 1;
    }

    heading.id = id;
  });

  return doc.body.innerHTML;
}

export default function PostDetail() {
  // 게시글 데이터와 관련된 상태 관리
  const [post, setPost] = useState(null); // 게시글 정보 저장
  const [error, setError] = useState(null); // 에러 메시지 저장
  const [isLikedByUser, setIsLikedByUser] = useState(false); // 사용자의 좋아요 상태 저장
  const [toc, setToc] = useState([]); // 목차 데이터 저장

  // 현재 URL에서 post ID 가져오기
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession(); // 사용자 세션 정보 가져오기

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postApi.getPost(params.id); // 특정 게시글 조회 API 호출
        setPost(data); // 게시글 데이터 설정
        setIsLikedByUser(data.isLikedByUser); // 서버에서 받은 사용자의 좋아요 상태 설정

        // 목차 데이터 생성
        const tocData = await generateTableOfContents(data.content);
        setToc(tocData);
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
        setError('게시글을 불러오는데 실패했습니다.');
        router.push('/not-found'); // 게시글이 없는 경우 404 페이지로 이동
      }
    };
    fetchPost();
  }, [params.id, router]);

  // 수정 페이지로 이동하는 함수
  const editPush = (e) => {
    router.push(`http://localhost:3000/edit/${params.id}`);
  };

  // 에러 발생 시 에러 메시지 출력
  if (error) return <div>{error}</div>;
  // 게시글 로딩 중에는 로딩 메시지 출력
  if (!post) return <div>로딩중...</div>;

  // 카테고리 이름 설정
  const categoryName = post.categoryId?.name || 'Uncategorized';

  // 게시글 수정 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/edit/${params.id}`); // 수정 페이지 경로로 이동
  };

  // 게시글 삭제 버튼 클릭 시 삭제 처리
  const handleDelete = async () => {
    if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      try {
        await postApi.deletePost(params.id); // 게시글 삭제 API 호출
        router.push('/'); // 메인 페이지로 이동
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        alert('게시글을 삭제하는 중 문제가 발생했습니다.');
      }
    }
  };

  // 좋아요 상태 업데이트 함수
  const updateLikesData = async () => {
    try {
      const updatedPost = await postApi.getPost(params.id); // 게시글 데이터를 다시 불러오기
      setPost(updatedPost); // 게시글 데이터 업데이트
      setIsLikedByUser(updatedPost.isLikedByUser); // 좋아요 상태 업데이트
    } catch (error) {
      console.error('좋아요 업데이트 후 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
  };

  // 적용된 헤딩 ID 마크다운 콘텐츠 생성
  const renderedContent = applyHeadingIds(md.render(post.content));

  return (
    <div className={styles.post_container}>
      {/* 네비게이션 컴포넌트 */}
      <header className={styles.header_section}>
        <Navigation />
        <h1 className={styles.post_title}>{post.title}</h1>
      </header>

      {/* 게시글 메타데이터 표시 */}
      <aside className={styles.aside_section}>
        <div className={styles.metadata_section}>
          <div className={styles.section_name}>/ METADATA</div>
          <table>
            <tbody>
              <tr>
                <th className={styles.metadata_label}>DATE</th>
                <td className={styles.metadata_value}>{post.createdAt.slice(0, 10)}</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>CATEGORY</th>
                <td className={styles.metadata_value}>{categoryName}</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>TAGS</th>
                <td className={styles.metadata_value}>{post.tags && post.tags.join(', ')}</td>
              </tr>
            </tbody>
          </table>
          {/* 링크 복사 버튼 */}
          <CopyLinkButton />
        </div>
        <div className={styles.toc_wrapper}>
          <div className={styles.section_name}>/ TABLE OF CONTENTS</div>
          <div className={styles.toc_content}>
            <ul>
              {toc.map((item) => (
                <li key={item.id} className={styles[`toc_level_${item.level}`]}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* 게시글 본문 표시 */}
      <div className={styles.article_section}>
        <div className={styles.article_header}>
          <div className={styles.section_name}>/ ARTICLE</div>
          {session && ( // 로그인된 경우에만 EDIT 및 DELETE 버튼 표시
            <div className={styles.article_btns}>
              <button className={styles.btn_edit} onClick={handleEdit}>EDIT</button>
              <button className={styles.btn_delete} onClick={handleDelete}>DELETE</button>
            </div>
          )}
        </div>
        <article className={styles.article_content}>
          {/* 게시글 본문을 마크다운 형식으로 렌더링하며 헤딩에 ID 적용 */}
          <div dangerouslySetInnerHTML={{
            __html: renderedContent
          }} />
        </article>
        {/* 좋아요 버튼 컴포넌트 */}
        <LikeButton
          postId={params.id} // 게시글 ID
          initialLikeCount={post.likes.length} // 초기 좋아요 수
          initialIsLiked={post.isLikedByUser} // 좋아요 클릭 여부
          LikesArray={post.likes} // 좋아요 ID 목록
          onLikeUpdate={updateLikesData} // 좋아요 상태 변경을 위한 콜백함수
        />
        {/* 댓글 컴포넌트 */}
        <div className={styles.comments_section}>
          <Comments postId={params.id} />
        </div>
      </div>

      {/* 푸터 컴포넌트 */}
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
