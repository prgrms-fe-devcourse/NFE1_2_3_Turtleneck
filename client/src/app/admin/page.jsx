'use client';

import { useState } from 'react';
import BlogSettings from './components/BlogSettings';
import Comments from './components/Comments';
import CategorySettings from './components/CategorySettings';
import styles from './page.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const [selectedTopic, setSelectedTopic] = useState('Blog Info');

  const renderContent = () => {
    switch (selectedTopic) {
      case 'Blog Info':
        return <BlogSettings />;
      case 'Comments':
        return <Comments />;
      case 'Category':
        return <CategorySettings />;
      default:
        return <BlogSettings />;
    }
  };

  return (
    <div className={styles.page}>
      <div className={`container ${styles.container}`}>
        <div className={styles.back_button}>
          <Image
            src="/images/arrow-left.png"
            width={33}
            height={34}
            alt="back button"
            onClick={goBack}
            className={styles.arrow_icon}
          />
        </div>
        <h1 className={styles.header}>SETTING</h1>

        <div className={styles.layout}>
          {/* 왼쪽 필터 */}
          <div className={styles.filters}>
            <div className={styles.filter_label}>/ FILTERS</div>
            <div className={styles.topic_list}>
              {/* Blog Info 메뉴 */}
              <div
                className={`${styles.topic_item} ${selectedTopic === 'Blog Info' ? styles.active : ''}`}
                onClick={() => setSelectedTopic('Blog Info')}
              >
                <div className={styles.topic_radio}>
                  {selectedTopic === 'Blog Info' && (
                    <div className={styles.radio_inner} />
                  )}
                </div>
                <span className={styles.topic_text}>Blog Info</span>
              </div>

              {/* Category 메뉴 */}
              <div
                className={`${styles.topic_item} ${selectedTopic === 'Category' ? styles.active : ''}`}
                onClick={() => setSelectedTopic('Category')}
              >
                <div className={styles.topic_radio}>
                  {selectedTopic === 'Category' && (
                    <div className={styles.radio_inner} />
                  )}
                </div>
                <span className={styles.topic_text}>Category</span>
              </div>

              {/* Comments 메뉴 */}
              <div
                className={`${styles.topic_item} ${selectedTopic === 'Comments' ? styles.active : ''}`}
                onClick={() => setSelectedTopic('Comments')}
              >
                <div className={styles.topic_radio}>
                  {selectedTopic === 'Comments' && (
                    <div className={styles.radio_inner} />
                  )}
                </div>
                <span className={styles.topic_text}>Comments</span>
              </div>
            </div>
          </div>

          {/* 오른쪽 콘텐츠 */}
          <div className={styles.content}>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
