import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// satori's font parser chokes on variable fonts, so the card uses the static
// cuts of the same family the site renders in.
const require = createRequire(import.meta.url);

const face = (weight: 400 | 600) =>
  readFile(
    require.resolve(
      `@fontsource/source-serif-4/files/source-serif-4-latin-${weight}-normal.woff`,
    ),
  );

// Read once per build rather than per card.
const fonts = Promise.all([face(400), face(600)]).then(
  ([regular, semibold]) =>
    [
      { name: "Source Serif 4", data: regular, weight: 400, style: "normal" },
      { name: "Source Serif 4", data: semibold, weight: 600, style: "normal" },
    ] as const,
);

// The light palette from global.css. The card is a fixed image, so it can't
// follow the reader's theme the way the site does.
const PAPER = "#eceee9";
const INK = "#1c383f";
const INK_SOFT = "#55696d";
const ACCENT = "#4f6f2e";

const WIDTH = 1200;
const HEIGHT = 630;

/** Long titles need to step down or they overflow the card. */
function titleSize(title: string) {
  if (title.length > 78) return 52;
  if (title.length > 48) return 62;
  return 74;
}

export interface CardOptions {
  title: string;
  description?: string;
  /** Rendered under the rule, e.g. a post's date. */
  footnote?: string;
}

export async function renderCard({
  title,
  description,
  footnote,
}: CardOptions): Promise<Buffer> {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "72px 80px",
          fontFamily: "Source Serif 4",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontSize: 26,
                letterSpacing: "0.04em",
                color: INK_SOFT,
              },
              children: "sn-p.sh",
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      fontSize: titleSize(title),
                      fontWeight: 600,
                      lineHeight: 1.15,
                      letterSpacing: "-0.011em",
                      color: INK,
                    },
                    children: title,
                  },
                },
                description && {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      marginTop: 26,
                      fontSize: 30,
                      lineHeight: 1.4,
                      color: INK_SOFT,
                    },
                    // Two lines of description is plenty at this size.
                    children:
                      description.length > 130
                        ? `${description.slice(0, 127).trimEnd()}…`
                        : description,
                  },
                },
              ].filter(Boolean),
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 20,
                fontSize: 24,
                color: INK_SOFT,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      width: 56,
                      height: 3,
                      background: ACCENT,
                    },
                  },
                },
                footnote && {
                  type: "div",
                  props: { style: { display: "flex" }, children: footnote },
                },
              ].filter(Boolean),
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts: [...(await fonts)] },
  );

  return Buffer.from(new Resvg(svg).render().asPng());
}
