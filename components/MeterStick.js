import styles from "../styles/MeterStick.module.css";

const Millimeters = ({ num }) => (
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

const Centimeter = ({ num }) => (
  <li className={styles.stick}>
    <span className={styles.stickValue}>{num}</span>
  </li>
);

const MeterStick = ({ units = ["1"], graduations = "centimeter" }) => {
  const Graduation = ({ ticks }) =>
    graduations === "centimeter" ? (
      <Centimeter key={ticks} num={ticks} />
    ) : (
      <Millimeters key={ticks} num={ticks} />
    );
  return (
    <div className={styles.ruler}>
      <ul className={styles.stickContainer}>
        {units.map((x) => (
          <Graduation key={x} ticks={x} />
        ))}
      </ul>
    </div>
  );
};

export default MeterStick;
