import { describe, expect, test } from "vitest";

import {
  extractHeadings,
  headingSlug,
  lexicalText,
  uniqueHeadingId,
} from "./headings";

const heading = (tag: string, text: string) => ({
  type: "heading",
  tag,
  children: [{ type: "text", text }],
});

describe("lexicalText", () => {
  test("joins the formatted runs a heading is made of", () => {
    expect(
      lexicalText({
        children: [
          { text: "Payments " },
          { children: [{ text: "that" }] },
          { text: " ship" },
        ],
      }),
    ).toBe("Payments that ship");
  });

  test("is empty for a node with no text", () => {
    expect(lexicalText({ type: "horizontalrule" })).toBe("");
  });
});

describe("headingSlug", () => {
  test.each([
    ["Payments that ship", "payments-that-ship"],
    ["  Spaced  out  ", "spaced-out"],
    ["What's the catch?", "whats-the-catch"],
    ["Node.js & TypeScript", "nodejs-typescript"],
  ])("%s becomes %s", (input, expected) => {
    expect(headingSlug(input)).toBe(expected);
  });

  test("keeps Arabic rather than stripping to an empty id", () => {
    // Stripping to ASCII would leave every Arabic heading with no id at all,
    // and the contents pointing at "#".
    expect(headingSlug("خدمات المدفوعات")).toBe("خدمات-المدفوعات");
  });

  test("is empty when there is nothing sluggable left", () => {
    expect(headingSlug("!!!")).toBe("");
  });
});

describe("uniqueHeadingId", () => {
  test("suffixes repeats so two headings never share an id", () => {
    const used = new Map<string, number>();
    expect(uniqueHeadingId("How it works", used)).toBe("how-it-works");
    expect(uniqueHeadingId("How it works", used)).toBe("how-it-works-2");
    expect(uniqueHeadingId("How it works", used)).toBe("how-it-works-3");
  });

  test("leaves unrelated headings alone", () => {
    const used = new Map<string, number>();
    expect(uniqueHeadingId("First", used)).toBe("first");
    expect(uniqueHeadingId("Second", used)).toBe("second");
  });
});

describe("extractHeadings", () => {
  test("takes the h2s in document order and ignores the rest", () => {
    const data = {
      root: {
        children: [
          heading("h2", "Scope"),
          { type: "paragraph", children: [{ text: "body" }] },
          heading("h3", "A subsection"),
          heading("h2", "Timeline"),
        ],
      },
    };
    expect(extractHeadings(data)).toEqual([
      { id: "scope", text: "Scope" },
      { id: "timeline", text: "Timeline" },
    ]);
  });

  test("de-duplicates the same wording", () => {
    const data = {
      root: { children: [heading("h2", "Scope"), heading("h2", "Scope")] },
    };
    expect(extractHeadings(data).map((h) => h.id)).toEqual([
      "scope",
      "scope-2",
    ]);
  });

  test("skips a heading that slugs to nothing", () => {
    const data = { root: { children: [heading("h2", "***")] } };
    expect(extractHeadings(data)).toEqual([]);
  });

  test.each([[null], [undefined], [{}], [{ root: {} }]])(
    "returns nothing for %s",
    (data) => {
      expect(extractHeadings(data)).toEqual([]);
    },
  );
});
