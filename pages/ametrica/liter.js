import Head from "next/head";
import styles from "../../styles/Liter.module.css";
import Cube from "../../components/Cube";

const Liter = () => {
  return (
    <>
      <Head>
        <title>Ametrica | Liter</title>
        <meta name="keywords" content="Liter" />
      </Head>
      <section name="meter">
        <h1 className="Heading__title pl-4">
          Ame<span className="blue">(t)</span>rica
        </h1>
        <article className="Section__article">
          <h2 className="Heading__title">Building upon what we have.</h2>
          <p>
            In daily life it often seems we are taking about distance in
            meters and kilometers. However when I make oatmeal in the morning
            I'm not talking about a lot of water. So perhaps we should make two
            assumptions.
          </p>
          <ul>
            <li>we can start with smaller units</li>
            <li>
              we will base everything on water since we use it more than any
              other liquid
            </li>
          </ul>
          <p>
            We already have a pattern going (this whole 10 base thing), so let's
            take a 1/10 or a decimeter and create a box.
          </p>
          <div className={styles.squareArea}>
            <span className={styles.measureTop}>1dm</span>
            <div className={styles.square}>&nbsp;</div>
            <span className={styles.measureSide}>1dm</span>

          </div>

          <p>
            so a cubed decimeter or 1dm<sup>3</sup>. If we take a liquid what everone has
            around like water and pour it into our box it would equal a liter.
            Done!
          </p>
          <p>Now we can apply our pattern from the meter.</p>

          <Cube height="128px" />
        </article>
      </section>
    </>
  );
};

export default Liter;
