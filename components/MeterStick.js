import styles from "../styles/MeterStick.module.css";

const Centimeter = ({ num }) => (
  <li className={styles.stick}>
    <ul className={styles.minorStickContainer}>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
      <li className={styles.minorStick}></li>
    </ul>
    <span className={styles.stickValue}>{num}</span>
  </li>
);

const MeterStick = ({ units = ["1"] }) => {
  return (
    <div className={styles.ruler}>
      <ul className={styles.stickContainer}>
        {units.map((x) => (
          <Centimeter key={x} num={x} />
        ))}
      </ul>
    </div>
  );
};

export default MeterStick;
