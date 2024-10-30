// PostCard 컴포넌트: 개별 게시물 카드 형식을 렌더링하는 컴포넌트
// category, date, image, title, tags와 같은 속성을 받아 화면에 보여줌

import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import styles from './PostCard.module.scss';

const PostCard = ({ category, date, image, title, tags }) => {
  // 이미지가 없을 경우 사용할 기본 이미지 경로
  // assets/imgs 접근 실패하여 public/favicon.png 사용
  const DEFAULT_IMAGE = '/favicon.png';

  return (
    <div className={styles.post_card}>
      {/* 카드 상단 부분: 카테고리, 날짜 표시 */}
      <div className={styles.post_card_header}>
        <span className={styles.post_card_category}>
          <span>■</span> {category}
        </span>
        <span className={styles.post_card_date}>{date}</span>
      </div>

      {/* 이미지 부분: 전달된 이미지가 없을 경우 기본 이미지 사용 */}
      <div className={styles.post_card_image_wrapper}>
        <Image
          className={styles.post_card_image}
          src={image || DEFAULT_IMAGE}
          fill
          alt={`image of ${title}`}
        />
      </div>

      {/* 게시글 제목 부분 */}
      <h3 className={styles.post_card_title}>{title}</h3>

      {/* 태그 부분: 각 태그의 형태를 버튼 형태로 표시 */}
      <div className={styles.post_card_tags}>
        {tags.map((tag, index) => (
          <button key={index} className={styles.post_card_tag}>
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

// 컴포넌트 타입 설정
PostCard.PropTypes = {
  category: PropTypes.string.isRequired, // 카테고리: string, 필수
  date: PropTypes.string.isRequired, // 날짜: string, 필수
  image: PropTypes.string, // 이미지: string, 선택
  title: PropTypes.string.isRequired, // 제목: string, 필수
  tags: PropTypes.arrayOf(PropTypes.string).isRequired, // 태그 배열: string, 선택
};

// 더미 게시글 카드 데이터
const dummyPosts = [
  {
    category: 'Tech',
    date: '20 JAN 2024',
    image:
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Understanding React Hooks: A Comprehensive Guide',
    tags: ['React', 'JavaScript', 'Hooks'],
  },
  {
    category: '21 JAN 2024',
    date: '2024-10-23',
    image: '',
    title: '10 Tips for a Better Work-Life Balance',
    tags: ['Life', 'Balance', 'Tips'],
  },
  {
    category: '22 JAN 2024',
    date: '2024-10-23',
    image: '',
    title:
      'Exploring the Future of Quantum Computing: How This Revolutionary Technology Will Transform Industries, Solve Complex Problems, and Push the Boundaries of What’s Possible in Science, Medicine, and Artificial Intelligence',
    tags: ['Quantum Computing', 'Technology', 'AI', 'Future', 'Complex'],
  },
];

// PostCardsList: 더미 게시글 카드를 렌더링하기 위한 컴포넌트
const PostCardsList = () => {
  return (
    <div>
      {dummyPosts.map((post, index) => (
        <PostCard
          key={index}
          category={post.category}
          date={post.date}
          image={post.image}
          title={post.title}
          tags={post.tags}
        />
      ))}
    </div>
  );
};

// 기본 내보내기(PostCard: 이 파일을 불러올 때 기본적으로 사용될 컴포넌트)
export default PostCard;

// 명시적인 내보내기(PostCardsList: 더미 게시글 카드를 출력하기 위해 명시적으로 가져올 컴포넌트)
export { PostCardsList };
