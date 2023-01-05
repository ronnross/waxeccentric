import styles from "./MediaBox.module.css";

const MediaBox = ({ children }) => (
  <div className={styles.mediaBox}>
    <div className={styles.textArea}>{children}</div>
    <div className={styles.imageArea}></div>
  </div>
);

export default MediaBox;
