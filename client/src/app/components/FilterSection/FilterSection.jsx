import { useState, useEffect } from 'react';
import styles from './FilterSection.module.scss';
import { categoryApi } from '@/utils/api';
import chevronIcon from '@/app/assets/imgs/chevron.png';
import folderIcon from '@/app/assets/imgs/folder.png';
import Image from 'next/image';

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
      <div className={styles.filtersContainer}>
        {/* Category 섹션 */}
        <div className={styles.filterColumn}>
          <h3 className={styles.sectionTitle}>
            <Image
              src={chevronIcon}
              alt="chevron"
              className={styles.chevronIcon}
              width={24}
              height={24}
            />
            <Image
              src={folderIcon}
              alt="folder"
              className={styles.folderIcon}
              width={24}
              height={24}
            />
            Category
          </h3>
          <div className={styles.listContainer}>
            <div className={styles.verticalDottedLine} />
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <label key={category._id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === category._id}
                    onChange={() => handleCategoryClick(category._id)}
                    className={styles.checkbox}
                  />
                  <div className={styles.labelText}>{category.name}</div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Tag 섹션 */}
        <div className={styles.filterColumn}>
          <h3 className={styles.sectionTitle}>
            <Image
              src={chevronIcon}
              alt="chevron"
              className={styles.chevronIcon}
              width={24}
              height={24}
            />
            <Image
              src={folderIcon}
              alt="folder"
              className={styles.folderIcon}
              width={24}
              height={24}
            />
            Tag
          </h3>
          <div className={styles.listContainer}>
            <div className={styles.verticalDottedLine} />
            <div className={styles.tagList}>
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <label key={tag} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagClick(tag)}
                      className={styles.checkbox}
                    />
                    <div className={styles.labelText}>{tag}</div>
                  </label>
                ))
              ) : (
                <p className={styles.noTags}>
                  카테고리를 선택하면 태그가 표시됩니다
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
