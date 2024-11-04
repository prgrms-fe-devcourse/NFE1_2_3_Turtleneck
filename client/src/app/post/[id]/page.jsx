// client/src/app/post/[id]/page.jsx

'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // URL에서 ID 가져오기
import { postApi } from '@/utils/api';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import mdHighlightjs from 'markdown-it-highlightjs';
import 'highlight.js/styles/github.css';
import styles from './post.module.scss';
import CopyLinkButton from '../components/CopyLinkButton';
import LikeButton from '../components/LikeButton';
import Navigation from '@/app/components/navigation';
import { useSession } from 'next-auth/react';

// 필요한 언어 등록 (예: JavaScript, Python 등)
hljs.registerLanguage(
  'javascript',
  require('highlight.js/lib/languages/javascript'),
);
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));

// MarkdownIt 인스턴스 생성 및 하이라이팅 플러그인 설정
const md = new MarkdownIt();
md.use(mdHighlightjs, { auto: true, hljs }); // auto 옵션을 통해 언어 자동 감지

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const params = useParams(); // 현재 URL의 params 사용하여 post ID 가져오기
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postApi.getPost(params.id); // 특정 게시글 조회 API 호출
        setPost(data);
        setIsLikedByUser(data.isLikedByUser); // 서버에서 받은 사용자의 좋아요 상태
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
        setError('게시글을 불러오는데 실패했습니다.');
        router.push('/not-found'); // not-found.js 페이지로 이동
      }
    };
    fetchPost();
  }, [params.id, router]);

  //edit버튼 이동기능
  const editPush = (e) => {
    router.push(`http://localhost:3000/edit/${params.id}`);
  };

  if (error) return <div>{error}</div>;
  if (!post) return <div>로딩중...</div>;

  const categoryName = post.categoryId?.name || 'Uncategorized';

  const handleEdit = () => {
    router.push(`/edit/${params.id}`); // 수정 페이지 경로로 이동
  };

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

  return (
    <div className={styles.post_container}>
      <header className={styles.header_section}>
        <Navigation />
        <h1 className={styles.post_title}>{post.title}</h1>
      </header>

      <aside className={styles.aside_section}>
        <div className={styles.metadata_section}>
          <div className={styles.section_name}>/ METADATA</div>
          <table>
            <tbody>
              <tr>
                <th className={styles.metadata_label}>DATE</th>
                <td className={styles.metadata_value}>
                  {post.createdAt.slice(0, 10)}
                </td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>CATEGORY</th>
                <td className={styles.metadata_value}>{categoryName}</td>
              </tr>
              <tr>
                <th className={styles.metadata_label}>TAGS</th>
                <td className={styles.metadata_value}>
                  {post.tags && post.tags.join(', ')}
                </td>
              </tr>
            </tbody>
          </table>
          <CopyLinkButton />
        </div>
      </aside>

      <div className={styles.article_section}>
        <div className={styles.article_header}>
          <div className={styles.section_name}>/ ARTICLE</div>
          {session && ( // 로그인된 경우에만 EDIT 및 DELETE 버튼 표시
            <div className={styles.article_btns}>
              <button className={styles.btn_edit} onClick={handleEdit}>
                EDIT
              </button>
              <button className={styles.btn_delete} onClick={handleDelete}>
                DELETE
              </button>
            </div>
          )}
        </div>
        <article className={styles.article_content}>
          <div dangerouslySetInnerHTML={{ __html: md.render(post.content) }} />
        </article>
        <LikeButton
          postId={params.id}
          initialLikeCount={post.likes.length}
          initialIsLiked={post.isLikedByUser}
          LikesArray={post.likes}
        />
        <div className={styles.comments_section}>
          <Comments postId={params.id} />
        </div>
      </div>
    </div>
  );
}
