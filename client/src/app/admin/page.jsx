'use client';

import { useState } from 'react';
import BlogSettings from './components/BlogSettings';
import Comments from './components/Comments';
import styles from './page.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const [selectedTopic, setSelectedTopic] = useState('Names & Category');

  const renderContent = () => {
    switch (selectedTopic) {
      case 'Names & Category':
        return <BlogSettings />;
      case 'Comments':
        return <Comments />;
      case 'Sections':
        return <div>섹션 관리 기능 구현 예정</div>;
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
              <div
                className={`${styles.topic_item} ${selectedTopic === 'Names & Category' ? styles.active : ''}`}
                onClick={() => setSelectedTopic('Names & Category')}
              >
                <div className={styles.topic_radio}>
                  {selectedTopic === 'Names & Category' && (
                    <div className={styles.radio_inner} />
                  )}
                </div>
                <span className={styles.topic_text}>Names & Category</span>
              </div>
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
              <div
                className={`${styles.topic_item} ${selectedTopic === 'Sections' ? styles.active : ''}`}
                onClick={() => setSelectedTopic('Sections')}
              >
                <div className={styles.topic_radio}>
                  {selectedTopic === 'Sections' && (
                    <div className={styles.radio_inner} />
                  )}
                </div>
                <span className={styles.topic_text}>Sections</span>
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
