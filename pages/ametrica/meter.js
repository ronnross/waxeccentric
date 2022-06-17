import Image from "next/image";
import Head from "next/head";

const Meter = () => {
  return (
    <>
      <Head>
        <title>some title</title>
        <meta name="keywords" content="Meter" />
      </Head>
      <div>
        <h1>just an Meter</h1>

        <Image src="/cossutius_foot.jpg" width={128} height={77} />
      </div>
    </>
  );
};

export default Meter;
