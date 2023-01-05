import Link from "next/link";
import styles from "./Navbar.module.css";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div>
        <h1>
          <Logo />
        </h1>
      </div>

      <nav>
        <Link href="/">Home</Link> &nbsp; | &nbsp;
        <Link href="/ametrica">Ametrica</Link>
      </nav>
    </header>
  );
};

export default Navbar;
