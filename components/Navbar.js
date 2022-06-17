import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <div>
        <h1>Some page</h1>
      </div>
      <Link href="/"><a>Home</a></Link>
      <Link href="/about"><a>About</a></Link>
      <Link href="/ametrica"><a>Ametrica</a></Link>
    </nav>
  );
};

export default Navbar;
