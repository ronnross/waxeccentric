import Link from "next/link";
import styles from "../styles/Navbar.module.css";


const Navbar = () => {
  return (
    <header className="navbar">
      <div>
        <h1>WE</h1>
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
