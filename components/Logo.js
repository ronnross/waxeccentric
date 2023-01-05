import Link from "next/link";
import styles from "./Logo.module.css";

const Logo = () => {
  return (
    <Link href="/" className={styles.logo}>
      <span className={styles.lefty}>W</span>
      <span className={styles.righty}>E</span>
    </Link>
  );
};

export default Logo;
