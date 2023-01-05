import NavList from "../../components/NavList";

export default function RootLayout({ children }) {
  return (
    <>
      <h1 className="Heading__title pl-4">
        Ame<span className="blue">(t)</span>rica
      </h1>
      <NavList />
      {children}
    </>
  );
}
