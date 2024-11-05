'use client';

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import Navigation from './components/navigation';
import Footer from './components/Footer';
import { MainPostList } from './components/MainPostCard/MainPostCard';
import PostCardsList from './components/PostCard/PostCard';
import { adminApi, postApi } from '@/utils/api';
import FilterSection from './components/FilterSection/FilterSection';

const POSTS_PER_PAGE = 6;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [adminSettings, setAdminSettings] = useState({
    nickname: '',
    blogTitle: '',
    blogInfo: '',
  });

  // 필터 변경 핸들러 추가
  const handleFilterChange = ({ categoryId, tags }) => {
    const newFilteredPosts = posts.filter((post) => {
      const matchesCategory =
        !categoryId || post.categoryId?._id === categoryId;
      const matchesTags =
        tags.length === 0 || tags.every((tag) => post.tags?.includes(tag));
      return matchesCategory && matchesTags;
    });

    setFilteredPosts(newFilteredPosts);
    setTotalPosts(newFilteredPosts.length);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminResponse, postsResponse] = await Promise.all([
          adminApi.getAdminSettings(),
          postApi.getAllPosts(),
        ]);

        setAdminSettings({
          nickname: adminResponse.admin.nickname || '',
          blogTitle: adminResponse.admin.blogTitle || '',
          blogInfo: adminResponse.admin.blogInfo || '',
        });

        const allPosts = Array.isArray(postsResponse) ? postsResponse : [];
        setPosts(allPosts);
        setFilteredPosts(allPosts); // 초기 필터링된 posts 설정
        setTotalPosts(allPosts.length);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // 현재 페이지의 포스트들
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
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
        </button>,
      );

      if (displayPages[0] > 2) {
        pages.push(
          <span key="ellipsis1" className={styles.ellipsis}>
            ...
          </span>,
        );
      }
    }

    // 중간 페이지들 추가
    displayPages.forEach((pageNum) => {
      pages.push(
        <button
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          className={`${styles.pageButton} ${
            currentPage === pageNum ? styles.active : ''
          }`}
        >
          {pageNum}
        </button>,
      );
    });

    // 마지막 페이지 추가
    if (displayPages[displayPages.length - 1] < totalPages) {
      if (displayPages[displayPages.length - 1] < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className={styles.ellipsis}>
            ...
          </span>,
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`${styles.pageButton} ${
            currentPage === totalPages ? styles.active : ''
          }`}
        >
          {totalPages}
        </button>,
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
          <h1 className={styles.title}>{adminSettings.blogTitle}</h1>
          <h2 className={styles.subtitle}>
            <span>{adminSettings.nickname}</span>의 하루
          </h2>
          <p className={styles.description}>{adminSettings.blogInfo}</p>
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

        <div className={styles.feed_name}>Feed</div>
        {/* 콘텐츠 컨테이너 */}
        <div className={styles.contentContainer}>
          {/* 필터 섹션 */}
          <aside className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <h2 className={styles.filterTitle}>/Filter</h2>
            </div>
            <FilterSection onFilterChange={handleFilterChange} />
          </aside>

          {/* 피드 섹션 - 필터링된 posts 사용 */}
          <section className={styles.feedSection}>
            <div className={styles.feedHeader}>
              <h2 className={styles.feedTitle}>/Post</h2>
            </div>
            <div className={styles.grid}>
              <PostCardsList posts={getCurrentPagePosts()} />
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className={styles.pagination}>{renderPagination()}</div>
            )}
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}
