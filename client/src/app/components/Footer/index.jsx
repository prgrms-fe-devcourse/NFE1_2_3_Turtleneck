import styles from './Footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className={styles.footer_wrap}>
      <div className={styles.f_left_block}>
        <div className={styles.f_section_github}>
          <div className={styles.f_H_stretch}>
            <h4 className={styles.f_section_title}>/ GITHUB</h4>
            <div className={styles.f_section_repository}>
              TURTLE_NECK_TECH_BLOG
              <br />
              PROJECT GITHUB REPOSITORY
            </div>
          </div>
          <Link href="https://github.com/prgrms-fe-devcourse/NFE1_2_3_TurtleNeck">
            <div className={styles.f_button}>Learn more</div>
          </Link>
        </div>

        <div className={styles.f_section_deco}>
          <div className={styles.f_H_bottom}>
            <Image
              src="/images/global.png"
              width={74}
              height={42}
              alt="deco global img"
            />
            <div className={styles.f_project_name}>© TURTLE NECK PROJECT</div>
          </div>
        </div>
      </div>

      <div className={styles.f_right_block}>
        <div className={styles.f_section_social}>
          <h4 className={styles.f_section_title}>/ SOCIAL</h4>
          <div className={styles.f_tag_wrap}>
            <Link href="https://youtube.com/shorts/0uR79gYldLQ?feature=shared">
              <div className={styles.f_tag}>YOUTUBE</div>
            </Link>
            <Link href="https://www.notion.so/2-05b003a7b59b4696b58bd300b848de8f?pvs=4">
              <div className={styles.f_tag}>NOTION</div>
            </Link>
            {/* <Link href="">
        <div className={styles.f_tag}>TWITTER/X</div>
      </Link>
      <Link href="">
        <div className={styles.f_tag}>BLUESKY</div>
      </Link> */}
          </div>
        </div>

        <div className={styles.f_section_resources}>
          <h4 className={styles.f_section_title}>/ MEMBERS</h4>
          <div className={styles.f_tag_wrap}>
            <Link href="https://github.com/ryan-g00">
              <div className={styles.f_tag}>RYANG</div>
            </Link>
            <Link href="https://github.com/Builter251">
              <div className={styles.f_tag}>BUILTER</div>
            </Link>
            <Link href="https://github.com/hyejun-fe">
              <div className={styles.f_tag}>HYEJUN</div>
            </Link>
            <Link href="https://github.com/neulrain">
              <div className={styles.f_tag}>SUJIN</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
