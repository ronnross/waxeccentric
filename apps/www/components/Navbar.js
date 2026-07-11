import Link from "next/link";
import Logo from "./Logo";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <Logo />

      <nav className={styles.navLinks} aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <Link href="/ametrica">Ametrica</Link>
        <a href="/verse/">Verse</a>
      </nav>
    </header>
  );
};

export default Navbar;
