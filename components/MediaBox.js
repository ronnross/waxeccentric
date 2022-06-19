import styles from "../styles/MediaBox.module.css";
import Image from "next/image";

const MediaBox = ({ image, alt, children }) => (
  <div className={styles.mediaBox}>
    <div className={styles.textArea}>{children}</div>
    <Image
      className={styles.imageArea}
      src={`/${image}`}
      alt={alt}
      width={400}
      height={500}
    />
  </div>
);

export default MediaBox;
