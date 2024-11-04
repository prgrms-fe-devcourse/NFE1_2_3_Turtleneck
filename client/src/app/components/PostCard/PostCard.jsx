// src/app/components/PostCard/PostCard.jsx

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import styles from './PostCard.module.scss';
import { postApi } from '@/utils/api';
import Link from 'next/link';

const PostCard = ({ postId, category, date, image, title, tags }) => {
  const DEFAULT_IMAGE = '/favicon.png';

  return (
    <Link href={`/post/${postId}`}>
      <div className={styles.post_card}>
        <div className={styles.post_card_header}>
          <span className={styles.post_card_category}>
            <span>■</span> {category}
          </span>
          <span className={styles.post_card_date}>{date}</span>
        </div>
        <div className={styles.post_card_image_wrapper}>
          <Image
            className={styles.post_card_image}
            src={image || DEFAULT_IMAGE}
            fill
            alt={`image of ${title}`}
          />
        </div>
        <h3 className={styles.post_card_title}>
          <Link href={`/post/${postId}`}>{title}</Link>
        </h3>
        <div className={styles.post_card_tags}>
          {tags.map((tag, index) => (
            <button key={index} className={styles.post_card_tag}>
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </Link>
  );
};

PostCard.propTypes = {
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const PostCardsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postApi.getAllPosts();
        setPosts(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('게시물을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!posts.length)
    return <div className={styles.no_posts}>게시물이 없습니다.</div>;

  return (
    <>
      {posts.map((post) => (
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
    </>
  );
};

export default PostCardsList;
