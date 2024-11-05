import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './MainPostCard.module.scss';
import { postApi } from '@/utils/api';

const MainPostCard = ({ post }) => {
  // 기본 이미지 경로 설정
  const DEFAULT_IMAGE = '/favicon.png';

  // post가 없으면 렌더링하지 않음
  if (!post) return null;

  // 카테고리 이름 추출 (카테고리가 없으면 'Uncategorized' 표시)
  const categoryName = post.categoryId?.name || 'Uncategorized';

  return (
    <article className={styles.main_post_card}>
      {/* 게시물 내용 영역 */}
      <div className={styles.content}>
        {/* 헤더: 카테고리와 날짜 표시 */}
        <div className={styles.header}>
          <span className={styles.category}>
            <span className={styles.dot}>■</span> {categoryName}
          </span>
          <span className={styles.date}>
            {post?.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : ''}
          </span>
        </div>

        {/* 포스트 제목과 내용을 눌러 해당 게시글로 이동 */}
        <Link href={`/post/${post._id}`} className={styles.post_link}>
          <h2 className={styles.title}>{post?.title}</h2>
          <p className={styles.description}>{post?.content}</p>
        </Link>

        {/* 태그 목록 */}
        <div className={styles.tags}>
          {Array.isArray(post?.tags) &&
            post.tags.map((tag, index) => (
              <button key={index} className={styles.tag}>
                #{tag}
              </button>
            ))}
        </div>
      </div>

      {/* 게시물 이미지 영역 */}
      <div className={styles.image_wrapper}>
        <Image
          className={styles.image}
          src={post.mainImage ? `${post.mainImage}` : DEFAULT_IMAGE}
          fill
          alt={`Main post image of ${post?.title || 'Post'}`}
        />
      </div>
    </article>
  );
};

const MainPostList = () => {
  // 상태 관리
  const [posts, setPosts] = useState([]); // 게시물 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 컴포넌트 마운트 시 최신 게시물 2개 불러오기
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        // postApi를 통해 최신 게시물 2개 요청
        const response = await postApi.getRecentPosts(2);
        // 응답이 배열인지 확인 후 상태 업데이트
        setPosts(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // 로딩 중 표시
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // 에러 발생 시 표시
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // 게시물이 없을 때 표시
  if (!Array.isArray(posts) || posts.length === 0) {
    return <div className={styles.no_posts}>게시물이 없습니다.</div>;
  }

  // 게시물 목록 렌더링
  return (
    <div className={styles.main_post_box}>
      {posts.map((post) => (
        <MainPostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

// PropTypes를 통한 타입 검증
MainPostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired, // 게시물 고유 ID
    title: PropTypes.string.isRequired, // 게시물 제목
    content: PropTypes.string.isRequired, // 게시물 내용
    mainImage: PropTypes.string, // 메인 이미지 경로 (선택)
    categoryId: PropTypes.shape({
      // 카테고리 정보
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.string), // 태그 배열
    createdAt: PropTypes.string, // 생성 날짜
  }).isRequired,
};

// 컴포넌트 내보내기
export default MainPostCard;
export { MainPostList };
