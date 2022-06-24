import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div>
        <h1><Logo /></h1>
      </div>

      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{" "}
        | &nbsp;
        <Link href="/ametrica/meter">
          <a>Ametrica</a>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
