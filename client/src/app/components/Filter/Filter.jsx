// components/Filter/Filter.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './Filter.module.scss';  // .scss 파일명 대소문자 주의
import { categoryApi } from '@/utils/api';


const Filter = ({ onFilterChange }) =>  {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState(new Set());

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryData = await categoryApi.getCategories();
        setCategories(categoryData);
        
        // 모든 태그 수집
        const allTags = new Set();
        categoryData.forEach(category => {
          if (category.tags) {
            category.tags.forEach(tag => allTags.add(tag));
          }
        });
        setTags(allTags);
      } catch (error) {
        console.error('카테고리 데이터 가져오기 실패:', error);
      }
    };

    fetchCategoryData();
  }, []);
  
// 카테고리 선택 핸들러
const handleCategoryChange = (categoryName) => {
    // 이미 선택된 카테고리를 다시 클릭하면 선택 해제
    const newCategory = selectedCategory === categoryName ? '' : categoryName;
    setSelectedCategory(newCategory);
    onFilterChange({
      categoryId: newCategory,
      tags: Array.from(selectedTags)
    });
  };

  // 태그 선택 핸들러
  const handleTagChange = (tag) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
    onFilterChange({
      categoryId: selectedCategory,
      tags: Array.from(newSelectedTags)
    });
  };

  return (
    <div className={styles.filter_container}>
      <div className={styles.filter_section}>
        <div className={styles.filter_header}>
        <span className={`material-symbols-outlined ${styles.folder_icon}`}>folder</span> Category
        </div>
        <div className={styles.filter_content}>

        {categories.map((category) => (
            <label key={category._id} className={styles.filter_item}>
                <input
                type="checkbox"
                checked={selectedCategory === category._id}
                onChange={() => handleCategoryChange(category._id)}
                className={styles.checkbox}
                />
                <span className={styles.checkbox_custom}></span>
                <span>{category.name}</span>
            </label>
            ))}
          
        </div>
      </div>

      <div className={styles.filter_section}>
        <div className={styles.filter_header}>
            <span className={`material-symbols-outlined ${styles.folder_icon}`}>folder</span> Tag
        </div>
        <div className={styles.filter_content}>


    {/* 태그 부분도 같은 방식으로 수정 */}
        {Array.from(tags).map((tag) => (
        <label key={tag} className={styles.filter_item}>
            <input
            type="checkbox"
            checked={selectedTags.has(tag)}
            onChange={() => handleTagChange(tag)}
            className={styles.checkbox}
            />
            <span className={styles.checkbox_custom}></span>
            <span>{tag}</span>
        </label>
        ))}
        </div>
      </div>
    </div>
  );
};
export default Filter;  // default export만 사용