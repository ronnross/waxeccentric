import Head from "next/head";
import Link from "next/link";

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
          <h2 className="Heading__title">Gram</h2>
          <p>
            In my daily life when I think of weight I mainly think of cooking.
            Of course I weight myself which is a considerable amount more than a
            pince of salt. So for weight let&apos;s think even smaller than a litter.
            What if we take just a mL and made a little box? Fill it with water.
            The weight of the water will equal our unit of weight. Reaching back
            into the Greek back and pulling out <i>gramma</i> meaning a small
            weight, run it through English and we get a Gram. If you have a
            paperclip near by it about that amount.
          </p>
          <p>
            If we take our liter of water that would weigh 1,000 grams or 1kg.
            If we put there through our table like the other measures we get.
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
                <td className="blue">gram</td>
                <td>
                  k<span className="blue">g</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&times;</td>
                <td>100</td>
                <td>hecto</td>
                <td className="blue">gram</td>
                <td>
                  h<span className="blue">g</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&times;</td>
                <td>10</td>
                <td>deka</td>
                <td className="blue">gram</td>
                <td>
                  da<span className="blue">g</span>
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="blue">gram</td>
                <td>
                  <span className="blue">g</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>10</td>
                <td>deci</td>
                <td className="blue">gram</td>
                <td>
                  d<span className="blue">g</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>100</td>
                <td>centi</td>
                <td className="blue">gram</td>
                <td>
                  c<span className="blue">g</span>
                </td>
              </tr>
              <tr>
                <td className="blue">&divide;</td>
                <td>1,000</td>
                <td>milli</td>
                <td className="blue">gram</td>
                <td>
                  m<span className="blue">g</span>
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            Don&apos;t go building scales just yet. For our day to day life what we
            did above is perfect, but if someone needs to be more percise (such
            as building scales) we need to be even more percise. At different
            templatures water will have a different density. I&apos;m talking about
            less than a gram between freezing and boiling. It would be easy to
            shrug this off, but I think of folks that distribute medicine, or
            for larger weights this error could compound. So if we are going to do
            it. let&apos;s do it right. and for that we need a tempature system. 
          </p>
          <Link href="/ametrica/celcius">
            <a>Let&apos;s measure tempature!</a>
          </Link>
        </article>
      </section>
    </>
  );
};

export default Gram;
