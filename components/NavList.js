import styles from "../styles/NavList.module.css";

const NavList = () => {
  return (
    <nav>
        <ul className={styles.navList}>
            <li>
                <a href="/ametrica/meter">Meter</a>
            </li>
            <li>
                <a href="/ametrica/gram">Gram</a>
            </li>
            <li>
                <a href="/ametrica/liter">Liter</a>
            </li>
            <li>
                <a href="/ametrica/celsius">Celsius</a>
            </li>
        </ul>
    </nav>
  );
};
export default NavList;
