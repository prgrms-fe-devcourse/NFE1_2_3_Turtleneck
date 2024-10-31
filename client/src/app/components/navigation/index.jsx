import styles from './navigation.module.scss';
import Link from 'next/link';
import { Inconsolata } from 'next/font/google';

const inconsolata = Inconsolata({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className="container">
        <div className={styles.navContent}>
          {/* 왼쪽 nav */}
          <div className={styles.leftMenu}>
            <Link href="/"className={`${styles.menuItem} ${inconsolata.className}`}>[H] HOME</Link>
            <Link href="/search" className={`${styles.menuItem} ${inconsolata.className}`}>[S] SEARCH</Link>
          </div>

          {/* 오른쪽 nav */}
          <div className={styles.rightMenu}>
            <Link href="/posting" className={`${styles.menuItem} ${inconsolata.className}`}>[P] POSTING</Link>
            <Link href="/setting" className={`${styles.menuItem} ${inconsolata.className}`}>[S] SETTING</Link>
            <Link href="/" className={`${styles.menuItem} ${inconsolata.className}`}>[L] LOGOUT</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
