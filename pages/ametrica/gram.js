import Head from "next/head";

const Gram = () => {
  return (
    <>
      <Head>
        <title>Ametrica | Gram</title>
        <meta name="keywords" content="Gram" />
      </Head>
      <section name="meter">
        <h1 className="Heading__title pl-4">
          Ame<span className="blue">(t)</span>rica
        </h1>
        <article className="Section__article">
          <h2 className="Heading__title">Building upon what we have.</h2>
          <p>
            Now we can do weight. Let's choose the name Gram based off the greek
            word for small piece or even letter. Since we are using a 10 based
            system we should start with a small measure for weight.

            Let take 1mL of water at 4degree celcius. and make that equal to a gram. Done!
            1L of water = 1kg

          </p>
        </article>
      </section>
    </>
  );
};

export default Gram;
