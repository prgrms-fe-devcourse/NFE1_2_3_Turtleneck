// login/page.jsx
'use client';
import styles from './login.module.scss';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.id) {
      setError('아이디를 입력해주세요');
      return;
    }
    if (!formData.password) {
      setError('비밀번호를 입력해주세요');
      return;
    }

    try {
      const res = await signIn('credentials', {
        id: formData.id,
        password: formData.password,
        redirect: false,
      });

      if (res.error) {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        return;
      }

      router.push('/');
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // 입력 시 에러 메시지 초기화
  };

  return (
    <div className={styles.login_wrap}>
      <div className={styles.login_box}>
        <div className={styles.login_title}>/ LOGIN</div>

        <form className={styles.login_form}>
          <div className={styles.input_wrap}>
            <label className={styles.input_label}>■ ID</label>
            <input
              name="id"
              type="text"
              className={styles.input_field}
              value={formData.id}
              onChange={handleChange}
            />
          </div>

          <div className={styles.input_wrap}>
            <label className={styles.input_label}>■ PASSWORD</label>
            <input
              name="password"
              type="password"
              className={styles.input_field}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && <div className={styles.error_message}>{error}</div>}

          <button
            type="submit"
            onClick={handleSubmit}
            className={styles.login_button}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
