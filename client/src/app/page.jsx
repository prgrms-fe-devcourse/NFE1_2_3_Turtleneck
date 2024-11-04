'use client';

import styles from './page.module.css';
import { useState } from 'react';
import Navigation from './components/navigation';
import Footer from './components/Footer';
import { MainPostList } from './components/MainPostCard/MainPostCard';
import PostCardsList from './components/PostCard/PostCard';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

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
          className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
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
          className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ''}`}
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
            <div className={styles.filterBox}></div>
          </aside>

          {/* 피드 섹션 */}
          <section className={styles.feedSection}>
            <div className={styles.feedHeader}>
              <h2 className={styles.feedTitle}>/Feed</h2>
            </div>
            <div className={styles.grid}>
              <PostCardsList />
            </div>

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
