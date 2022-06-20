import styles from "../styles/MediaBox.module.css";
import Image from "next/image";

const MediaBox = ({ image, children }) => (
  <div className={styles.mediaBox}>
    <div className={styles.textArea}>{children}</div>
    <Image
      className={styles.imageArea}
      src={`/${image}`}
      alt="a foot"
      width={400}
      height={500}
    />
  </div>
);

export default MediaBox;
