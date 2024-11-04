'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import Navigation from './components/navigation';
import Footer from './components/Footer';
import { MainPostList } from './components/MainPostCard/MainPostCard';
import PostCard from './components/PostCard/PostCard';
import Filter from './components/Filter/Filter';
import { postApi } from '@/utils/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postApi.getAllPosts();
        const postsData = Array.isArray(response) ? response : [];
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  
  const handleFilterChange = ({ categoryId, tags }) => {
    let filtered = [...posts];
  
    // 카테고리 필터링
    if (categoryId) {
      filtered = filtered.filter(post => {
        // categoryId가 객체인 경우 name으로 비교
        if (post.categoryId && typeof post.categoryId === 'object') {
          return post.categoryId.name === categoryId;
        }
        // categoryId가 문자열인 경우 직접 비교
        return post.categoryId === categoryId;
      });
    }
  
    // 태그 필터링
    if (tags && tags.length > 0) {
      filtered = filtered.filter(post => {
        // post.tags가 없는 경우 false 반환
        if (!post.tags) return false;
        // 선택된 태그 중 하나라도 포함되어 있으면 true
        return tags.some(selectedTag => post.tags.includes(selectedTag));
      });
    }
  
    setFilteredPosts(filtered);
  };

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    let pages = [];
    const displayPages = [];

    // 현재 페이지 주변의 페이지들 추가
    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      displayPages.push(i);
    }

    // 첫 페이지 추가
    if (displayPages[0] > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`${styles.pageButton} ${currentPage === 1 ? styles.active : ''}`}
        >
          1
        </button>
      );

      if (displayPages[0] > 2) {
        pages.push(
          <span key="ellipsis1" className={styles.ellipsis}>
            ...
          </span>
        );
      }
    }

    // 중간 페이지들 추가
    displayPages.forEach((pageNum) => {
      pages.push(
        <button
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
        >
          {pageNum}
        </button>
      );
    });

    // 마지막 페이지 추가
    if (displayPages[displayPages.length - 1] < totalPages) {
      if (displayPages[displayPages.length - 1] < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className={styles.ellipsis}>
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ''}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={styles.main}>
      <Navigation />

      <div className="container">
        {/* 히어로 섹션 */}
        <div className={styles.hero}>
          <h1 className={styles.title}>천방지축 돌아가는</h1>
          <h2 className={styles.subtitle}>
            <span>거북목</span>의 하루
          </h2>
          <p className={styles.description}>
            거북목 팀의 블로그에 오신것을 환영합니다.
            <br />
            지금까지 보지못한 멋진 기술 블로그를 구현할
            <br />수 있다는 것을 보여드리겠습니다
          </p>
        </div>

        {/* 메인 포스트 섹션 */}
        <div className={styles.main_post_section}>
          <div className={styles.main_post_header}>
            <div className={styles.main_post_title}>/main post</div>
          </div>
          <div className={styles.main_post_box}>
            <MainPostList />
          </div>
        </div>

        {/* 콘텐츠 컨테이너 */}
        <div className={styles.contentContainer}>
          {/* 필터 섹션 */}
          <aside className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <h2 className={styles.filterTitle}>/Filter</h2>
            </div>
            <div className={styles.filterBox}>
              <Filter onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* 피드 섹션 */}
          <section className={styles.feedSection}>
            <div className={styles.feedHeader}>
              <h2 className={styles.feedTitle}>/Feed</h2>
            </div>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : !filteredPosts.length ? (
              <div className={styles.no_posts}>게시물이 없습니다.</div>
            ) : (
              <div className={styles.grid}>
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    postId={post._id}
                    category={post.categoryId?.name || 'Uncategorized'}
                    date={new Date(post.createdAt).toLocaleDateString()}
                    image={post.mainImage}
                    title={post.title}
                    tags={post.tags || []}
                  />
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            <div className={styles.pagination}>{renderPagination()}</div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}