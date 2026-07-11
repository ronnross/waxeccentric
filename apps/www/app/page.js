import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroScene} aria-hidden="true">
          <span className={styles.cometOne}></span>
          <span className={styles.cometTwo}></span>
          <span className={styles.ringOne}></span>
          <span className={styles.ringTwo}></span>
          <span className={styles.markerOne}></span>
          <span className={styles.markerTwo}></span>
          <span className={styles.markerThree}></span>
        </div>

        <p className={styles.eyebrow}>Wax Eccentric</p>
        <h1 id="home-title" className={styles.title}>
          A collection of odds and ends from eccentric thinking.
        </h1>
        <p className={styles.lede}>
          A small constellation of writing and tools: part
          poetry, part notebook for ideas that prefer an unusual orbit.
        </p>
        <div className={styles.actions}>
          <a className={styles.primaryAction} href="/ametrica">
            Explore Ametrica
          </a>
          <a className={styles.secondaryAction} href="/verse/">
            Open Verse
          </a>
        </div>
      </section>

      <section className={styles.workbench} aria-label="Featured projects">
        <a className={styles.feature} href="/ametrica">
          <span className={styles.featureIndex}>01</span>
          <span className={styles.featureTitle}>Ametrica</span>
          <span className={styles.featureText}>
            A hands-on walk through metric ideas, built from rulers, water, and
            a little practical imagination.
          </span>
        </a>
        <a className={styles.feature} href="/verse/">
          <span className={styles.featureIndex}>02</span>
          <span className={styles.featureTitle}>Verse</span>
          <span className={styles.featureText}>
            A poetry interface that turns a block of text into discoverable
            stanzas and illuminated fragments.
          </span>
        </a>
        <div className={styles.feature}>
          <span className={styles.featureIndex}>03</span>
          <span className={styles.featureTitle}>More Soon</span>
          <span className={styles.featureText}>
            The monorepo is ready for more small worlds under the Wax Eccentric
            banner.
          </span>
        </div>
      </section>
    </main>
  );
}
