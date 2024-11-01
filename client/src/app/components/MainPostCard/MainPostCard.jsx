import Image from 'next/image';
import PropTypes from 'prop-types';
import styles from './MainPostCard.module.scss';

// 더미 데이터
const dummyMainPosts = [
  {
    category: 'Tech',
    date: '20 JAN 2024',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Node.js 라이브러리 백포파이프라인에 물리기',
    description: '라이브러리 관리와 배포 프로세스를 자동화하는 방법을 상세히 설명하는 글로 라이브러리 관리에 있어 수행해야 하는 다양한 작업들을 설명합니다.',
    tags: ['Node.js', 'Pipeline', 'Library']
  },
  {
    category: 'Web',
    date: '21 JAN 2024',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '코어 웹 바이털(Core Web Vitals) 알아보기',
    description: '이용자에게 실제로 제공되는 웹 경험을 체계화하여 전달하는 방법과 Google이 이를 활용하는 방식을 알아봅니다.',
    tags: ['Web Performance', 'SEO', 'Core Web Vitals']
  }
];

// MainPostCard 컴포넌트
const MainPostCard = ({ post }) => {
  const DEFAULT_IMAGE = '/favicon.png';

  return (
    <article className={styles.main_post_card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.category}>
            <span className={styles.dot}>■</span> {post.category}
          </span>
          <span className={styles.date}>{post.date}</span>
        </div>

        <h2 className={styles.title}>{post.title}</h2>
        
        <p className={styles.description}>{post.description}</p>

        <div className={styles.tags}>
          {post.tags.map((tag, index) => (
            <button key={index} className={styles.tag}>
              #{tag}
            </button>
          ))}
        </div>
      </div>g

      <div className={styles.image_wrapper}>
        <Image
          className={styles.image}
          src={post.image || DEFAULT_IMAGE}
          fill
          alt={`Main post image of ${post.title}`}
        />
      </div>
    </article>
  );
};

MainPostCard.propTypes = {
  post: PropTypes.shape({
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

// 더미데이터를 사용하는 MainPostList 컴포넌트
const MainPostList = () => {
  return (
    <div className={styles.main_post_box}>
      {dummyMainPosts.map((post, index) => (
        <MainPostCard key={index} post={post} />
      ))}
    </div>
  );
};

// 기본 내보내기: MainPostCard 컴포넌트
export default MainPostCard;

// 명시적 내보내기: MainPostList 컴포넌트와 더미데이터
export { MainPostList, dummyMainPosts };