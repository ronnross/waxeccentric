import Link from "next/link";
import styles from "../styles/Logo.module.css";

const Logo = () => {
  return (
    <Link href="/" className={styles.logo}>
      <a>
        <span className={styles.lefty}>W</span>
        <span className={styles.righty}>E</span>
      </a>
    </Link>
  );
};

export default Logo;
