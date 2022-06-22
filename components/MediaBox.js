import styles from "../styles/MediaBox.module.css";
import Image from "next/image";

const MediaBox = ({ children }) => (
  <div className={styles.mediaBox}>
    <div className={styles.textArea}>{children}</div>
    <div className={styles.imageArea}></div>
  </div>
);

export default MediaBox;
