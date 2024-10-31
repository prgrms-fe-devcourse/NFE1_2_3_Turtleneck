import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 Not Found</h1>
      <div className={styles.message}>
        <p>죄송합니다! 해당 페이지를 찾을 수 없습니다.</p>
        <p>존재하지 않는 주소를 입력하셨거나,</p>
        <p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다..</p>
      </div>
      <div className={styles.icon}>
        ☹
      </div>
      <Link href="/" className={styles.home_button}>
        홈으로
      </Link>
    </div>
  );
}