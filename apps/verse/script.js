/**
 * Renders all POEMS as one continuous "blob" of text inside #textblock.
 * Each poem becomes a <span class="section" data-poem-id="..."> containing
 * its stanzas flattened into plain running text (no line breaks).
 *
 * Interaction:
 *  - hover  -> highlights the section (color change) via CSS :hover
 *  - click  -> expands the section, swapping its content from blob text to
 *              properly formatted stanzas in place. An "x" close button
 *              appears in the expanded view to collapse it back to blob text.
 *              Only one poem may be expanded at a time; opening a new one
 *              collapses whichever poem was previously open.
 *
 * A right-hand index (#poem-index) lists every poem title; clicking a title
 * expands that poem's section in the textblock and scrolls it into view.
 * The reverse also holds: expanding a poem (from the textblock or the
 * index) highlights its matching title in the index via the "active" class.
 * The first letter of each poem's opening line is wrapped in a "drop-cap"
 * span for an illuminated-manuscript initial (styled in style.css).
 */
let currentlyExpandedSection = null;
const sectionsByPoemId = new Map();
const indexLinksByPoemId = new Map();
function flattenToBlobText(poem) {
  return poem.stanzas.map((stanza) => stanza.join(" ")).join(" ");
}

function buildStanzaMarkup(poem) {
  return poem.stanzas
    .map((stanza, stanzaIndex) => {
      const lines = stanza.map((line, lineIndex) => {
        if (stanzaIndex === 0 && lineIndex === 0) {
          const firstChar = line.charAt(0);
          const rest = line.slice(1);
          return `<span class="drop-cap">${firstChar}</span>${rest}`;
        }
        return line;
      });
      return `<span class="stanza">${lines.join("<br>")}</span>`;
    })
    .join("");
}

function renderTextblock() {
  const container = document.getElementById("textblock");
  container.innerHTML = "";

  POEMS.forEach((poem) => {
    const section = document.createElement("span");
    section.className = "section";
    section.dataset.poemId = poem.id;
    section.dataset.title = poem.title;
    section.textContent = `${flattenToBlobText(poem)} `;
    section.setAttribute("tabindex", "0");
    section.setAttribute("role", "button");
    section.setAttribute("aria-expanded", "false");

    section.addEventListener("click", () => {
      if (!section.classList.contains("expanded")) {
        expandSection(section, poem);
      }
    });
    section.addEventListener("keydown", (event) => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        !section.classList.contains("expanded")
      ) {
        event.preventDefault();
        expandSection(section, poem);
      } else if (
        event.key === "Escape" &&
        section.classList.contains("expanded")
      ) {
        event.preventDefault();
        collapseSection(section, poem);
      }
    });

    container.appendChild(section);
    sectionsByPoemId.set(poem.id, section);
  });
}

function renderPoemIndex() {
  const list = document.getElementById("poem-index");
  list.innerHTML = "";

  POEMS.forEach((poem) => {
    const item = document.createElement("li");
    const link = document.createElement("button");
    link.type = "button";
    link.className = "poem-index-link";
    link.textContent = poem.title;
    link.addEventListener("click", () => openPoemFromIndex(poem));
    item.appendChild(link);
    list.appendChild(item);
    indexLinksByPoemId.set(poem.id, link);
  });
}

function openPoemFromIndex(poem) {
  const section = sectionsByPoemId.get(poem.id);
  if (!section) {
    return;
  }
  if (!section.classList.contains("expanded")) {
    expandSection(section, poem);
  }
  section.scrollIntoView({ behavior: "smooth", block: "center" });
}

function expandSection(section, poem) {
  if (currentlyExpandedSection && currentlyExpandedSection !== section) {
    const previousPoem = POEMS.find(
      (p) => p.id === currentlyExpandedSection.dataset.poemId,
    );
    collapseSection(currentlyExpandedSection, previousPoem);
  }

  section.classList.add("expanded");
  section.setAttribute("aria-expanded", "true");
  section.innerHTML = `
    <button type="button" class="close-button" aria-label="Close poem">&times;</button>
    <span class="poem-title">${poem.title}</span>${buildStanzaMarkup(poem)}
  `;

  const closeButton = section.querySelector(".close-button");
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    collapseSection(section, poem);
  });

  currentlyExpandedSection = section;

  const indexLink = indexLinksByPoemId.get(poem.id);
  if (indexLink) {
    indexLink.classList.add("active");
  }
}

function collapseSection(section, poem) {
  section.classList.remove("expanded");
  section.setAttribute("aria-expanded", "false");
  section.innerHTML = "";
  section.textContent = `${flattenToBlobText(poem)} `;
  section.focus();

  if (currentlyExpandedSection === section) {
    currentlyExpandedSection = null;
  }

  const indexLink = indexLinksByPoemId.get(poem.id);
  if (indexLink) {
    indexLink.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTextblock();
  renderPoemIndex();
});
