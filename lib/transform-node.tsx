import { Element, DOMNode } from 'html-react-parser';

export const transformNode = (node: DOMNode): DOMNode | null => {
  if (!(node instanceof Element)) return node;

  const { name, attribs } = node;

  if (!attribs) return node;

  // Applying classes to paragraph tags
  if (name === "p") {
    let className = "leading-7 mt-6";
    if (attribs.class) {
      className = `${attribs.class} ${className}`;
    }
    attribs.class = className;
  }

  // Add classes to anchor tags
  if (name === "a") {
    attribs.class = "font-medium text-primary underline underline-offset-4";
  }

  // Add classes to heading tags
  if (name === "h1") {
    attribs.class = "scroll-m-20 text-2xl font-extrabold pt-4 tracking-tight lg:text-3xl";
  }

  if (name === "h2") {
    attribs.class = "mt-10 scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight transition-colors first:mt-0";
  }

  if (name === "h3") {
    attribs.class = "mt-8 scroll-m-20 text-lg font-semibold tracking-tight";
  }

  return node;
};
