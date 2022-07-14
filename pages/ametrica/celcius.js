import Head from "next/head";
import Link from "next/link";

const Celcius = () => {
  return (
    <>
      <Head>
        <title>Ametrica | Celcius</title>
        <meta name="keywords" content="Celcius" />
      </Head>
      <section name="meter">
        <h1 className="Heading__title pl-4">
          Ame<span className="blue">(t)</span>rica
        </h1>
        <article className="Section__article">
          <h2 className="Heading__title">Celcius</h2>

          <p>
            We are using water as the source for the liter and gram. Why not use
            it for our tempature scale. When it come to water we are often
            concerned with two tempatures, freezing and boiling point.
            <br />
            <br />
            What if we set 0 as the freezing point of water. Then set 100 as the
            boiling point of water? Then we have 100 units or degrees(°) to work
            with. This is keeping with our theme of being practical. After
            testing this scale in different tempatures in between freezing and
            boiling a nice pattern emerges.
            <br />
            starting at 0 and moving to 10 is cold and coat weather.
            <br />
            Moving towards 20 is cooler and needs jacket. <br />
            Nearing 30 is hot and time for shorts. <br />
          </p>
          <p>
            We could work this into a little poem to make it easy to remember:
            <br />
            30 is hot.
            <br />
            20 is pleasing.
            <br />
            10 is cold
            <br />
            0 is freezing
            <br />
          </p>
          <p>
            Ok I understand that some of this is preference and one might were a
            jacket while another opts for short sleeves, but this is a good rule
            of thumb. As we live with the system we will get an understanding of
            our personal preferences.
          </p>
          <p>
            Some other temps we might want to remember. <br />
            Room tempature is around 20° to 22°.
            <br />
            Our body tempature is about 37°.
          </p>
          <p>
            We metioned in the section defining the{" "}
            <Link href="/ametrica/gram">
              <a>Gram</a>
            </Link>{" "}
            that water&apos;s weight changes in different tempatures. We can find
            which tempature water is at its most dense and us that for our gram.
            Turns out it is 4°. Now we can build scales!
          </p>
          <p>
            Finally, for the name of this system. Here is where we will take a
            detour from our method of naming and name it after a person Anders
            Celcius. By going with Celcius and not a more general Greek term for
            tempature, we can avoid confusion with another tempature system we
            might need for something else; like measuring absolute zero.
          </p>
        </article>
      </section>
    </>
  );
};

export default Celcius;
