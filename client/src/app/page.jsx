import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      {/* 네비게이션 /> */}
      
      <div className="container">
        {/* 히어로 섹션 */}
        <div className={styles.hero}>
          <h1 className={styles.title}>천방지축 돌아가는</h1>
          <h2 className={styles.subtitle}><span>거북목</span>의 하루</h2>
          <p className={styles.description}>
            거북목 팀의 블로그에 오신것을 환영합니다.<br></br>
            지금까지 보지못한 멋진 기술 블로그를 구현할<br></br>
            수 있다는 것을 보여드리겠습니다
          </p>
        </div>

        {/* 메인 포스트 */}
        <div className={styles.main_post_section}>
          <div className={styles.main_post_header}>
              <div className={styles.main_post_title}>/main post</div>
          </div>
          <div className={styles.main_post_box}>
            <article className={styles.card}>
      
            </article>
            <article className={styles.card}>
          
            </article>
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

            </div>
          </aside>

          {/* 피드 섹션 */}
          <section className={styles.feedSection}>
            <div className={styles.feedHeader}>
              <h2 className={styles.feedTitle}>/Feed</h2>
            </div>
            <div className={styles.grid}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className={styles.placeholder}>
                  {/* 카드 컴포넌트 영역 */}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        {/* 푸터 영역 */}
      </footer>
    </div>
  );
}