import { visit } from "unist-util-visit";

const langOf = (node) =>
  node.properties?.["data-language"] ?? node.properties?.dataLanguage;

const isWrapper = (node) =>
  node?.tagName === "div" &&
  [].concat(node.properties?.className ?? []).includes("code-block");

/**
 * Wraps each highlighted <pre> in a positioned div.
 *
 * The language chip has to hang off something that doesn't scroll. Absolutely
 * positioning it inside the <pre> anchors it to that element's padding box,
 * which scrolls with the code, so on a wide block the label drifts inward.
 */
export function rehypeCodeBlocks() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === null) return;
      if (isWrapper(parent)) return; // already wrapped
      const lang = langOf(node);
      if (!lang) return;

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block"], "data-language": lang },
        children: [node],
      };
    });
  };
}
