import { visit } from "unist-util-visit";

// Recognised kinds and the word each one announces itself with.
const KINDS = {
  note: "Note",
  warning: "Warning",
  aside: "Aside",
};

/**
 * Turns `:::note` / `:::warning` container directives into a semantic
 * <aside>, so an editorial note is a different thing from a blockquote.
 * A blockquote should mean someone is being quoted.
 */
export function remarkCallouts() {
  return (tree, file) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective") return;
      const kind = node.name;
      if (!(kind in KINDS)) {
        file.message(`Unknown callout kind ":::${kind}"`, node);
        return;
      }

      // An optional label: `:::note[Heads up]`
      let label = KINDS[kind];
      const first = node.children[0];
      if (first && first.data && first.data.directiveLabel) {
        label = first.children.map((c) => c.value ?? "").join("");
        node.children.shift();
      }

      node.data = {
        hName: "aside",
        hProperties: { class: `callout callout-${kind}` },
      };
      node.children.unshift({
        type: "paragraph",
        data: { hName: "p", hProperties: { class: "callout-label" } },
        children: [{ type: "text", value: label }],
      });
    });
  };
}
