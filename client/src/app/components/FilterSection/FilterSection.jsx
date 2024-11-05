import { useState, useEffect } from 'react';
import styles from './FilterSection.module.scss';
import { categoryApi } from '@/utils/api';

const FilterSection = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryApi.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
        setSelectedTags([]);
        setAvailableTags([]);
        onFilterChange({ categoryId: null, tags: [] });
      } else {
        setSelectedCategory(categoryId);
        const categoryData = await categoryApi.getCategory(categoryId);
        setAvailableTags(categoryData.tags || []);
        setSelectedTags([]);
        onFilterChange({ categoryId, tags: [] });
      }
    } catch (error) {
      console.error('카테고리 상세 정보 로딩 실패:', error);
    }
  };

  const handleTagClick = (tag) => {
    let newSelectedTags;
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    setSelectedTags(newSelectedTags);
    onFilterChange({ categoryId: selectedCategory, tags: newSelectedTags });
  };

  return (
    <div className={styles.filterBox}>
      <div className={styles.categorySection}>
        <h3 className={styles.sectionTitle}>Category</h3>
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <button
              key={category._id}
              className={`${styles.categoryButton} ${
                selectedCategory === category._id ? styles.active : ''
              }`}
              onClick={() => handleCategoryClick(category._id)}
            >
              <span>■</span> {category.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && availableTags.length > 0 && (
        <div className={styles.tagSection}>
          <h3 className={styles.sectionTitle}>Tags</h3>
          <div className={styles.tagList}>
            {availableTags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tagButton} ${
                  selectedTags.includes(tag) ? styles.active : ''
                }`}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
