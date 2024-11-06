import { useState, useEffect } from 'react';
import { adminApi } from '@/utils/api';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 초기 데이터 로드
  const fetchData = async () => {
    try {
      const adminData = await adminApi.getAdminSettings();
      const settings = {
        nickname: adminData.admin.nickname || '',
        blogTitle: adminData.admin.blogTitle || '',
        blogInfo: adminData.admin.blogInfo || '',
      };
      setSettings(settings);
      setTempSettings(settings);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className={styles.content}>
      <div className={styles.setting_header}>/ SETTING</div>
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
    </div>
  );
};

export default BlogSettings;
