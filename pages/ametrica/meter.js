import Head from "next/head";
import MeterStick from "../../components/MeterStick";
import MediaBox from "../../components/MediaBox";
import Link from "next/link";

const Meter = () => {
  return (
    <>
      <Head>
        <title>Ametrica | Meter</title>
        <meta name="keywords" content="Meter" />
      </Head>
      <section name="meter">
        <h1 className="Heading__title pl-4">
          Ame<span className="blue">(t)</span>rica
        </h1>
        <article className="Section__article">
          <h2 className="Heading__title">Simple and Practical.</h2>
          <p>
            Everyone needs to measure things. Perhaps we should measure together
            with a common system. This system should have a high emphasis on
            being practical and simple. Maybe the easiest way to get started is
            with distance. We need something as a base for our length. What
            about this?
          </p>
          <MeterStick units={["0", "1"]} />
          <p>
            This <i>ruler</i> is arbitrary for now. It is some random fixed
            width for the moment with several equally spaced lines. We need to
            name our ruler so it is not confused with anything else. Let&apos;s use
            ...
          </p>
          <MediaBox>
            <h2>Meter</h2>
            <p>
              It comes from the Classic Greek word <i>Metron</i> meaning to
              measure.
            </p>
          </MediaBox>
          <p>
            Ok, now we have a name and some set length. We are all set! Let&apos;s
            put it use. For our first experiment we can measure our hand 🖐.
          </p>
          <p>
            🚨 Well, we have already encountered a problem. Our hand is less
            than the length of our ruler. Seems we need to divide our ruler into
            smaller peices. <br /> 🤔 <br />
          </p>
          <p>
            Let&apos;s see if cutting into smaller pieces fixes this issue. Let&apos;s
            try 100 sections, and since we already started with a classic
            language let&apos;s continue. We chose Greek for our whole measure let
            us use Latin for our fractional units so we can tell the difference
            if we are using smaller units or whole units. Do not over think the
            naming. 100 in Latin is <i>Centum</i>. With a little conjugation we
            get <i>Centi</i>. Add that with our ruler&apos;s name we have{" "}
            <i>Centimeter</i>.
          </p>
          <MeterStick
            units={["1", "2", "3", "4", "...", "97", "98", "99", "100"]}
          />
          <h3>Great! 🎉 </h3>
          <p>
            We get just over 19 centimeters (or 19cm). But our hand hangs just
            over one of the number markers. Perhaps we need to divide the ruler
            event more.
            <br />
            <br />
            Let&apos;s add another 0 and try 1000. Using the same method as before
            1000 in Latin is Milli. Adding our ruler name we have{" "}
            <i>Millimeter</i>
          </p>
          <MeterStick
            units={["1", "2", "3", "4", "...", "997", "998", "999", "1000"]}
          />
          <p>
            That gives us more accuracy. The hand we measured comes to 19.3cm or
            193 millimeters (193mm). With this success let&apos;s set our sites on
            something longer like ourselves. Let&apos;s measure our height. Ok, now
            we have a different problem. Our ruler is not large enough so we
            have to use more than one ruler.
          </p>
          <p>
            We get 1 ruler (or 1 meter) and 70 centimeters (average height in
            the U.S.). We can add them together using a decimal form and get 1.7
            meters (or 1.7m).
            <br />
            <br />
            Now I&apos;m getting excited. Mainly because it is so easy to move
            between the units.
          </p>
          <MediaBox>
            <h2>Base 10</h2>
            <i>1.7m</i>
            <i>170cm</i>
            <i>1700mm</i>
          </MediaBox>
          <p>
            I can do this in my head with little thought. That is what I call
            simple and practical just like our system for currency.
          </p>
          <p>
            We should try one last thing. Measuring a great distance. Let&apos;s
            measure how far we are from our favorite restaurant.
            <br />
            <br />
            Ok I have mine. I&apos;m going to lay the meter sticks end to end
            until I reach my destination.
          </p>
          <MeterStick
            units={["1", "2", "3", "4", "...", "97", "98", "99", "100"]}
          />
          <MeterStick
            units={["1", "2", "3", "4", "...", "97", "98", "99", "100"]}
          />
          ...
          <MeterStick
            units={["1", "2", "3", "4", "...", "97", "98", "99", "100"]}
          />
          <MeterStick
            units={["1", "2", "3", "4", "...", "97", "98", "99", "100"]}
          />
          <p>
            Oh wow! It took me 1,100 sticks. What about you?
            <br />
            Well I&apos;m thinking we need a name for large measure, because
            I&apos;m not saying 1 thousand and 100 meters all the time. How
            about we use 1000 like we did when dividing our ruler. I know you
            might be thinking we cannot use Milli or it will cause issues. Well
            remember what we said earlier? We are using Greek for large
            measures. Greek for 1000 is Kilo. Now we have a Kilometer or km. My
            favorite restaurant is 1.1km from my home.
          </p>
          <p>
            Let me take some liberties and fill out the rest of measure names
            and add it to a table.
          </p>
          <table className="table">
            <thead>
              <tr>
                <th colSpan="2">Amount</th>
                <th>Prefix</th>
                <th>Measure</th>
                <th>Abbreviation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="blue">&times;</td>
                <td>1,000</td>
                <td>kilo</td>
                <td className="blue">meter</td>
                <td>
                  k<span className="blue">m</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&times;</td>
                <td>100</td>
                <td>hecto</td>
                <td className="blue">meter</td>
                <td>
                  h<span className="blue">m</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&times;</td>
                <td>10</td>
                <td>deka</td>
                <td className="blue">meter</td>
                <td>
                  da<span className="blue">m</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="blue">meter</td>
                <td>
                  <span className="blue">m</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>10</td>
                <td>deci</td>
                <td className="blue">meter</td>
                <td>
                  d<span className="blue">m</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>100</td>
                <td>centi</td>
                <td className="blue">meter</td>
                <td>
                  c<span className="blue">m</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>1,000</td>
                <td>milli</td>
                <td className="blue">meter</td>
                <td>
                  m<span className="blue">m</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            We have one last problem to solve. I have the ruler here at my home.
            How do I get this ruler to you? I mean I could always mail it, but
            what happens if it gets damaged, lost, or worse shrinks a little
            over time.
            <br />
            <br />
            We need something more reliable to share the exact size of our
            ruler. It should be something outside of a physical object. So light
            is very abundant. We can define a meter as the length of the path
            tavelled by light in a vacuum in
            <br />
            <br />
            <MediaBox>
              <span role="math" className="Equation">
                <div className="group">
                  <span className="num">1</span>
                  <span className="sr-only">/</span>
                  <span className="den">299,792,458</span>
                </div>
                <div>of a second</div>
              </span>
            </MediaBox>
            <br />I can give you this equation. Now you would need some
            equipment to measure light in a vacuum, but the point is you do not
            something physical to create rulers for you or your friends. If we
            stick to the equation we all have the same size ruler. Incredible!
          </p>
          <p>
            Ok, I&apos;m tired of measuring all that. I think I need a drink.
            Perhaps we can use what we created to measure our beverage.
          </p>
          <Link href="/ametrica/liter">
            <a>Time to measure liquids!!!</a>
          </Link>
          {/* <button className="Button" type="button">
            Coming soon. Time to measure liquids!!!
          </button> */}
        </article>
      </section>
    </>
  );
};

export default Meter;
