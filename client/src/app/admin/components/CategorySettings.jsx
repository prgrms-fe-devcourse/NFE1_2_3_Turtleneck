import { useState, useEffect } from 'react';
import { adminApi, categoryApi } from '@/utils/api';
import styles from './CategorySettings.module.scss';

const CategorySettings = () => {
  // 메인 섹션 관련 상태
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  // 카테고리 관리 관련 상태
  const [categories, setCategories] = useState([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminData, categoriesData] = await Promise.all([
          adminApi.getAdminSettings(),
          categoryApi.getCategories(),
        ]);

        setSelectedMainCategory(adminData.admin.mainPostCategoryId || '');
        setCategories(categoriesData);
      } catch (error) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 메인 섹션 카테고리 변경 핸들러
  const handleMainCategoryChange = async (categoryId) => {
    try {
      const response = await adminApi.updateMainPostCategory(categoryId);

      if (response.admin) {
        setSelectedMainCategory(response.admin.mainPostCategoryId);
      } else {
        throw new Error('서버 응답에 admin 데이터가 없습니다.');
      }
    } catch (error) {
      setError('메인 포스트 카테고리 업데이트에 실패했습니다.');
    }
  };

  // 카테고리 관리 관련 핸들러
  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const updatedCategories = await categoryApi.createCategory(newCategory);
      setCategories(updatedCategories);
      setNewCategory('');
      setShowNewCategoryForm(false);
    } catch (error) {
      setError('카테고리 생성에 실패했습니다.');
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const updateCategory = async (id) => {
    try {
      const updatedCategories = await categoryApi.updateCategory(
        id,
        editingName,
      );
      setCategories(updatedCategories);
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      setError('카테고리 수정에 실패했습니다.');
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const updatedCategories = await categoryApi.deleteCategory(id);
        setCategories(updatedCategories);
      } catch (error) {
        setError('카테고리 삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className={styles.content}>
      {/* 메인 섹션 설정 */}
      <div className={styles.section}>
        <div className={styles.section_header}>
          <div className={styles.section_title}>MAIN SECTIONS</div>
        </div>
        <div className={styles.main_section_setting}>
          <select
            className={styles.section_select}
            value={selectedMainCategory}
            onChange={(e) => handleMainCategoryChange(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 카테고리 관리 섹션 */}
      <div className={styles.section}>
        <div className={styles.section_header}>
          <div className={styles.section_title}>CATEGORY</div>
          <button
            className={styles.add_button}
            onClick={() => setShowNewCategoryForm(true)}
          >
            +
          </button>
        </div>

        {showNewCategoryForm && (
          <div className={styles.category_form}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="새 카테고리 이름"
              className={styles.category_input}
            />
            <div className={styles.form_buttons}>
              <button
                className={styles.cancel_button}
                onClick={() => setShowNewCategoryForm(false)}
              >
                CANCEL
              </button>
              <button className={styles.save_button} onClick={addCategory}>
                SAVE
              </button>
            </div>
          </div>
        )}

        <div className={styles.category_list}>
          {categories.map((category) => (
            <div key={category._id} className={styles.category_item}>
              {editingId === category._id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className={styles.category_input}
                  />
                  <div className={styles.category_buttons}>
                    <button
                      className={styles.save_button}
                      onClick={() => updateCategory(category._id)}
                    >
                      SAVE
                    </button>
                    <button
                      className={styles.cancel_button}
                      onClick={cancelEdit}
                    >
                      CANCEL
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.category_name}>{category.name}</span>
                  <div className={styles.category_buttons}>
                    <button
                      className={styles.edit_button}
                      onClick={() => startEdit(category)}
                    >
                      EDIT
                    </button>
                    <button
                      className={styles.delete_button}
                      onClick={() => deleteCategory(category._id)}
                    >
                      DELETE
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CategorySettings;
