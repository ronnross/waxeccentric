import CopyToken from "./CopyToken";

const sections = [
  { id: "typography", label: "Typography" },
  { id: "colors", label: "Colors" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius" },
  { id: "shadows", label: "Shadows" },
  { id: "components", label: "Components" },
];

export default function ThemePage() {
  const colors = [
    { token: "--color-primary", label: "Primary", value: "#007B34" },
    {
      token: "--color-primary-hover",
      label: "Primary Hover",
      value: "#00491F",
    },
    {
      token: "--color-primary-light",
      label: "Primary Light",
      value: "#BDE9C9",
    },
    { token: "--color-accent", label: "Accent", value: "#00A749" },
    { token: "--color-accent-hover", label: "Accent Hover", value: "#007B34" },
    { token: "--color-accent-light", label: "Accent Light", value: "#E8F5E9" },
    { token: "--color-surface", label: "Surface", value: "#ffffff" },
    { token: "--color-background", label: "Background", value: "#FAFAF5" },
    { token: "--color-text", label: "Text", value: "#1A1A1A" },
    { token: "--color-text-muted", label: "Text Muted", value: "#5A5A5A" },
    { token: "--color-border", label: "Border", value: "#D6D6D0" },
  ];

  const semanticColors = [
    {
      token: "--color-success",
      label: "Success",
      value: "#007B34",
      light: "#BDE9C9",
    },
    {
      token: "--color-danger",
      label: "Danger",
      value: "#D32F2F",
      light: "#FDECEA",
    },
    {
      token: "--color-warning",
      label: "Warning",
      value: "#F9A825",
      light: "#FFF8E1",
    },
  ];

  const spacingTokens = [
    { token: "--space-xs", label: "XS", value: "4px" },
    { token: "--space-sm", label: "SM", value: "8px" },
    { token: "--space-md", label: "MD", value: "16px" },
    { token: "--space-lg", label: "LG", value: "24px" },
    { token: "--space-xl", label: "XL", value: "32px" },
    { token: "--space-2xl", label: "2XL", value: "48px" },
  ];

  const radii = [
    { token: "--radius-sm", label: "SM", value: "4px" },
    { token: "--radius-md", label: "MD", value: "6px" },
    { token: "--radius-lg", label: "LG", value: "10px" },
  ];

  const shadows = [
    { token: "--shadow-sm", label: "Small" },
    { token: "--shadow-md", label: "Medium" },
    { token: "--shadow-lg", label: "Large" },
  ];

  return (
    <div className="theme-page">
      <div className="page-header">
        <h2 className="page-title">Theme Guide</h2>
      </div>

      {/* Anchor Navigation */}
      <nav className="theme-toc">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="theme-toc__link">
            {s.label}
          </a>
        ))}
      </nav>

      {/* Typography */}
      <section id="typography" className="theme-section">
        <h3 className="theme-section__title">Typography</h3>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Font Families</h4>
          <div className="theme-font-list">
            <div className="theme-font-card card">
              <span className="theme-font-card__token">--font-sans</span>
              <p
                className="theme-font-card__sample"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Nunito — Headings, Body &amp; UI
              </p>
              <p
                className="theme-font-card__preview"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                }}
              >
                Kallos Sthenos
              </p>
              <p
                className="theme-font-card__weights"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span style={{ fontWeight: 300 }}>Light 300</span>
                <span style={{ fontWeight: 400 }}>Regular 400</span>
                <span style={{ fontWeight: 500 }}>Medium 500</span>
                <span style={{ fontWeight: 600 }}>Semi 600</span>
                <span style={{ fontWeight: 700 }}>Bold 700</span>
              </p>
            </div>

            <div className="theme-font-card card">
              <span className="theme-font-card__token">--font-mono</span>
              <p
                className="theme-font-card__sample"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                System Mono — Code &amp; Tokens
              </p>
              <p
                className="theme-font-card__preview"
                style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}
              >
                font-family: var(--font-mono);
              </p>
            </div>
          </div>
        </div>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Type Scale</h4>
          <div className="theme-type-scale">
            <div className="theme-type-row">
              <span className="theme-type-row__label">Page Title</span>
              <span
                className="theme-type-row__sample page-title"
                style={{ marginBottom: 0 }}
              >
                Kallos Sthenos
              </span>
              <span className="theme-type-row__spec">Nunito 700 / 1.5rem</span>
            </div>
            <div className="theme-type-row">
              <span className="theme-type-row__label">Section Title</span>
              <span
                className="theme-type-row__sample section-title"
                style={{ borderBottom: "none", paddingBottom: 0 }}
              >
                Warm-Up
              </span>
              <span className="theme-type-row__spec">
                Nunito 700 / 0.875rem / Uppercase
              </span>
            </div>
            <div className="theme-type-row">
              <span className="theme-type-row__label">Card Title</span>
              <span className="theme-type-row__sample card-title">
                Push Day — Upper Body
              </span>
              <span className="theme-type-row__spec">
                Nunito 700 / 1.0625rem
              </span>
            </div>
            <div className="theme-type-row">
              <span className="theme-type-row__label">Body</span>
              <span className="theme-type-row__sample">
                Default body text for descriptions and content.
              </span>
              <span className="theme-type-row__spec">
                Nunito 400 / 1rem / 1.6 line-height
              </span>
            </div>
            <div className="theme-type-row">
              <span className="theme-type-row__label">Small / Meta</span>
              <span
                className="theme-type-row__sample"
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-muted)",
                }}
              >
                3 sets × 12 reps
              </span>
              <span className="theme-type-row__spec">
                Nunito 400 / 0.8125rem / Muted
              </span>
            </div>
            <div className="theme-type-row">
              <span className="theme-type-row__label">Button / Label</span>
              <span
                className="theme-type-row__sample"
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Start Workout
              </span>
              <span className="theme-type-row__spec">
                Nunito 700 / 0.8125rem / Uppercase
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section id="colors" className="theme-section">
        <h3 className="theme-section__title">Colors</h3>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Core Palette</h4>
          <div className="theme-color-grid">
            {colors.map((c) => (
              <div key={c.token} className="theme-color-card">
                <div
                  className="theme-color-card__swatch"
                  style={{ backgroundColor: c.value }}
                />
                <div className="theme-color-card__info">
                  <span className="theme-color-card__label">{c.label}</span>
                  <CopyToken text={c.token} />
                  <CopyToken text={c.value} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Semantic Colors</h4>
          <div className="theme-color-grid">
            {semanticColors.map((c) => (
              <div key={c.token} className="theme-color-card">
                <div className="theme-color-card__swatch theme-color-card__swatch--split">
                  <div style={{ backgroundColor: c.value, flex: 1 }} />
                  <div style={{ backgroundColor: c.light, flex: 1 }} />
                </div>
                <div className="theme-color-card__info">
                  <span className="theme-color-card__label">{c.label}</span>
                  <CopyToken text={c.token} />
                  <span className="theme-color-card__value">
                    {c.value} / {c.light}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section id="spacing" className="theme-section">
        <h3 className="theme-section__title">Spacing</h3>
        <div className="theme-spacing-list">
          {spacingTokens.map((s) => (
            <div key={s.token} className="theme-spacing-row">
              <span className="theme-spacing-row__label">{s.label}</span>
              <div
                className="theme-spacing-row__bar"
                style={{ width: s.value }}
              />
              <CopyToken text={s.token} />
              <span className="theme-spacing-row__value">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Radius */}
      <section id="radius" className="theme-section">
        <h3 className="theme-section__title">Border Radius</h3>
        <div className="theme-radius-list">
          {radii.map((r) => (
            <div key={r.token} className="theme-radius-card">
              <div
                className="theme-radius-card__box"
                style={{ borderRadius: r.value }}
              />
              <span className="theme-radius-card__label">{r.label}</span>
              <CopyToken text={r.token} />
              <span className="theme-radius-card__value">{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section id="shadows" className="theme-section">
        <h3 className="theme-section__title">Shadows</h3>
        <div className="theme-shadow-list">
          {shadows.map((s) => (
            <div
              key={s.token}
              className="theme-shadow-card"
              style={{ boxShadow: `var(${s.token})` }}
            >
              <span className="theme-shadow-card__label">{s.label}</span>
              <CopyToken text={s.token} />
            </div>
          ))}
        </div>
      </section>

      {/* Components */}
      <section id="components" className="theme-section">
        <h3 className="theme-section__title">Components</h3>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Buttons</h4>
          <div className="theme-component-row">
            <button className="btn btn--primary">Primary</button>
            <button className="btn btn--secondary">Secondary</button>
            <button className="btn btn--danger">Danger</button>
            <button className="btn btn--success">Success</button>
            <button className="btn btn--ghost">Ghost</button>
            <button className="btn btn--primary" disabled>
              Disabled
            </button>
          </div>
          <div className="theme-component-row">
            <button className="btn btn--primary btn--sm">Small Primary</button>
            <button className="btn btn--secondary btn--sm">
              Small Secondary
            </button>
          </div>
        </div>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Badges</h4>
          <div className="theme-component-row">
            <span className="badge">Default</span>
            <span className="badge badge--primary">Primary</span>
            <span className="badge badge--success">Success</span>
            <span className="badge badge--danger">Danger</span>
            <span className="badge badge--warning">Warning</span>
          </div>
        </div>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Cards</h4>
          <div className="theme-card-grid">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Default Card</span>
                <span className="badge badge--primary">Push</span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                Standard card with header and body content.
              </p>
            </div>
            <div className="card card--completed">
              <div className="card-header">
                <span className="card-title">Completed Card</span>
                <span className="badge badge--success">Done</span>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-text-muted)",
                }}
              >
                Card with completed state styling.
              </p>
            </div>
          </div>
        </div>

        <div className="theme-subsection">
          <h4 className="theme-subsection__title">Form Elements</h4>
          <div className="theme-form-demo">
            <div className="form-group">
              <label className="form-label">Text Input</label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter exercise name…"
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Select</label>
              <select className="form-select" defaultValue="">
                <option value="" disabled>
                  Choose muscle group…
                </option>
                <option>Upper Push</option>
                <option>Upper Pull</option>
                <option>Lower</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Textarea</label>
              <textarea
                className="form-textarea"
                placeholder="Coaching notes…"
                readOnly
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
