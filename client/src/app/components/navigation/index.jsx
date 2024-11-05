import styles from './navigation.module.scss';
import Link from 'next/link';
import { Inconsolata } from 'next/font/google';
import { useSession, signOut } from 'next-auth/react';

const inconsolata = Inconsolata({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function Navigation() {
  const { data: session } = useSession();

  // 로그아웃 완료 후 홈페이지로 이동
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <nav className={styles.nav}>
      <div className="container">
        <div className={styles.navContent}>
          {/* 왼쪽 nav - 항상 표시 */}
          <div className={styles.leftMenu}>
            <Link
              href="/"
              className={`${styles.menuItem} ${inconsolata.className}`}
            >
              [H] HOME
            </Link>
            <Link
              href="/search"
              className={`${styles.menuItem} ${inconsolata.className}`}
            >
              [S] SEARCH
            </Link>
          </div>

          {/* 오른쪽 nav - 로그인 상태에 따라 다르게 표시 */}
          <div className={styles.rightMenu}>
            {session ? (
              // 로그인된 상태
              <>
                <Link
                  href="/write"
                  className={`${styles.menuItem} ${inconsolata.className}`}
                >
                  [P] POSTING
                </Link>
                <Link
                  href="/admin"
                  className={`${styles.menuItem} ${inconsolata.className}`}
                >
                  [S] SETTING
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${styles.menuItem} ${inconsolata.className} ${styles.logout_button}`}
                >
                  [L] LOGOUT
                </button>
              </>
            ) : (
              // 로그인되지 않은 상태
              <Link
                href="/login"
                className={`${styles.menuItem} ${inconsolata.className}`}
              >
                [L] LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
