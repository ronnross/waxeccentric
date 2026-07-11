import Link from "next/link";
import Logo from "./Logo";
import styles from "./Navbar.module.css";

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
        <Link href="/ametrica">Ametrica</Link> &nbsp; | &nbsp;
        <a href="/verse/">Verse</a>
      </nav>
    </header>
  );
};

export default Navbar;
