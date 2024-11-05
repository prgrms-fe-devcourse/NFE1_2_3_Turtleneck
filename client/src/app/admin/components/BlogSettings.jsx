// client/src/app/admin/components/BlogSettings.jsx
import { useState, useEffect } from 'react';
import { adminApi, categoryApi } from '@/utils/api';
import styles from './BlogSettings.module.scss';

const BlogSettings = () => {
  const [settings, setSettings] = useState({
    nickname: '',
    blogTitle: '',
    blogInfo: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    nickname: '',
    blogTitle: '',
    blogInfo: '',
  });

  const [categories, setCategories] = useState([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 초기 데이터 로드
  const fetchData = async () => {
    try {
      const [adminData, categoriesData] = await Promise.all([
        adminApi.getAdminSettings(),
        categoryApi.getCategories(),
      ]);

      const settings = {
        nickname: adminData.admin.nickname || '',
        blogTitle: adminData.admin.blogTitle || '',
        blogInfo: adminData.admin.blogInfo || '',
      };
      setSettings(settings);
      setTempSettings(settings);
      setCategories(categoriesData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 기본 정보 수정 관련 함수들
  const handleEdit = () => {
    setEditMode(true);
    setTempSettings({ ...settings });
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      setEditMode(false);
      setTempSettings({ ...settings });
    }
  };

  const handleSave = async () => {
    if (window.confirm('저장하시겠습니까?')) {
      try {
        for (const [key, value] of Object.entries(tempSettings)) {
          if (value !== settings[key]) {
            await adminApi.updateSetting(key, value);
          }
        }
        setSettings({ ...tempSettings });
        setEditMode(false);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // 카테고리 관련 함수들
  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const updatedCategories = await categoryApi.createCategory(newCategory);
      setCategories(updatedCategories);
      setNewCategory('');
      setShowNewCategoryForm(false);
    } catch (error) {
      setError(error.message);
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
      setError(error.message);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const updatedCategories = await categoryApi.deleteCategory(id);
        setCategories(updatedCategories);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className={styles.content}>
      <div className={styles.setting_header}>
        / SETTING
      </div>
      <div className={styles.setting_list}>
        <div className={styles.setting_item}>
          <div className={styles.setting_label}>NICKNAME</div>
          {editMode ? (
            <input
              className={styles.setting_input}
              type="text"
              value={tempSettings.nickname}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  nickname: e.target.value,
                })
              }
            />
          ) : (
            <div className={styles.setting_value}>{settings.nickname}</div>
          )}
        </div>

        <div className={styles.setting_item}>
          <div className={styles.setting_label}>BLOG NAME</div>
          {editMode ? (
            <input
              className={styles.setting_input}
              type="text"
              value={tempSettings.blogTitle}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  blogTitle: e.target.value,
                })
              }
            />
          ) : (
            <div className={styles.setting_value}>{settings.blogTitle}</div>
          )}
        </div>

        <div className={styles.setting_item}>
          <div className={styles.setting_label}>INFORMATION</div>
          {editMode ? (
            <input
              className={styles.setting_input}
              type="text"
              value={tempSettings.blogInfo}
              onChange={(e) =>
                setTempSettings({
                  ...tempSettings,
                  blogInfo: e.target.value,
                })
              }
            />
          ) : (
            <div className={styles.setting_value}>{settings.blogInfo}</div>
          )}
        </div>

        {editMode ? (
          <div className={styles.button_group}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div className={styles.edit_button}>
            <button onClick={handleEdit}>Edit</button>
          </div>
        )}
      </div>

      <div className={styles.category_section}>
        <div className={styles.category_header}>
          <div className={styles.category_title}>CATEGORY</div>
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
            />
            <div className={styles.form_buttons}>
              <button onClick={() => setShowNewCategoryForm(false)}>
                CANCEL
              </button>
              <button onClick={addCategory}>SAVE</button>
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
                  />
                  <div className={styles.category_buttons}>
                    <button onClick={() => updateCategory(category._id)}>
                      SAVE
                    </button>
                    <button onClick={cancelEdit}>CANCEL</button>
                  </div>
                </>
              ) : (
                <>
                  <span>{category.name}</span>
                  <div className={styles.category_buttons}>
                    <button onClick={() => startEdit(category)}>EDIT</button>
                    <button onClick={() => deleteCategory(category._id)}>
                      DELETE
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSettings;
