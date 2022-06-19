import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <div>
        <h1>WE</h1>
      </div>
      <Link href="/">
        <a>Home</a>
      </Link>{" "}
      | &nbsp;
      <Link href="/ametrica">
        <a>Ametrica</a>
      </Link>
    </nav>
  );
};

export default Navbar;
