import Link from "next/link";
import styles from "../styles/NavList.module.css";

const NavList = () => {
  return (
    <nav>
        <ul className={styles.navList}>
            <li>
                <Link href="/ametrica/meter">Meter</Link>
            </li>
            <li>
                <Link href="/ametrica/gram">Gram</Link>
            </li>
            <li>
                <Link href="/ametrica/liter">Liter</Link>
            </li>
            <li>
                <Link href="/ametrica/celsius">Celsius</Link>
            </li>
        </ul>
    </nav>
  );
};
export default NavList;
