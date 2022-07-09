import Head from "next/head";
import styles from "../../styles/Liter.module.css";
import MeterStick from "../../components/MeterStick";
import Cube from "../../components/Cube";
import Link from "next/link";

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
            I once heard water is the source of all life. So that seems like a
            great liquid to work with. It makes it nice that we can just turn on
            a tap to get it.
            <br />
            <br />
            Since we have already done the hard work of creating the meter, we
            should build on that good work and use it to create our volume
            measurement.
            <br />
            <br />
            My first thought is we can build a box 1m wide, 1m deep, and 1m tall
            (1m<sup>3</sup>).
            <br />
            <br />
            🚨 Wait!
            <br />
            <br />
            Without even constructing the box I can tell that is going to be a
            lot of water. Perhaps we should start smaller. Maybe only a 10th,
            and if you remember we already defined that as a decimeter.
            <br />
            <br />
            Let&apos;s take the decimeter and create a box.
          </p>
          <div className={styles.squareArea}>
            <span className={styles.measureTop}>1dm</span>
            <div className={styles.square}>&nbsp;</div>
            <span className={styles.measureSide}>1dm</span>
          </div>
          <MeterStick
            units={[
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "...",
              "100",
            ]}
          />

          <p>
            Now let&apos;s set the height, width, and depth to 1 decimeter or 1dm
            <sup>3</sup>.
          </p>
          <Cube height="128px" />
          <p>
            That will work. Now for a name. We can pull an old measure name from
            the Greek archives. How about litra or for us a liter. We are nearly finished.
            <br />
            <br />
            Now we can apply our pattern from the meter.
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
                <td className="blue">liter</td>
                <td>
                  k<span className="blue">l</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&times;</td>
                <td>100</td>
                <td>hecto</td>
                <td className="blue">liter</td>
                <td>
                  h<span className="blue">l</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&times;</td>
                <td>10</td>
                <td>deka</td>
                <td className="blue">liter</td>
                <td>
                  da<span className="blue">l</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="blue">liter</td>
                <td>
                  <span className="blue">l</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>10</td>
                <td>deci</td>
                <td className="blue">liter</td>
                <td>
                  d<span className="blue">l</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>100</td>
                <td>centi</td>
                <td className="blue">liter</td>
                <td>
                  c<span className="blue">l</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>1,000</td>
                <td>milli</td>
                <td className="blue">liter</td>
                <td>
                  m<span className="blue">l</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Great job!
            <br />
            <br />
            Now I&apos;m curious how much does this liter weigh?
          </p>
          <Link href="/ametrica/gram">
            <a>Time to weigh in</a>
          </Link>
        </article>
      </section>
    </>
  );
};

export default Liter;
