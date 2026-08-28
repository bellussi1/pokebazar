const fs = require("fs");
const path = require("path");

const projectRoot = __dirname;
const outputDirectory = path.join(projectRoot, "dist");
const sourcePath = path.join(projectRoot, "index.html");
const outputPath = path.join(outputDirectory, "index.html");
const templateQuote = String.fromCharCode(96);

function readQuoted(source, start, quote) {
  let index = start + 1;
  while (index < source.length) {
    if (source[index] === "\\") {
      index += 2;
      continue;
    }
    if (source[index] === quote) return index + 1;
    index += 1;
  }
  return source.length;
}

function readTemplateExpression(source, start) {
  let index = start;
  let depth = 0;
  while (index < source.length) {
    const character = source[index];
    if (character === "'" || character === '"') {
      index = readQuoted(source, index, character);
      continue;
    }
    if (character === templateQuote) {
      index = readTemplate(source, index);
      continue;
    }
    if (character === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      index = end < 0 ? source.length : end + 2;
      continue;
    }
    if (character === "/" && source[index + 1] === "/") {
      const end = source.indexOf("\n", index + 2);
      index = end < 0 ? source.length : end + 1;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      if (depth === 0) return index + 1;
      depth -= 1;
    }
    index += 1;
  }
  return source.length;
}

function readTemplate(source, start) {
  let index = start + 1;
  while (index < source.length) {
    if (source[index] === "\\") {
      index += 2;
      continue;
    }
    if (source[index] === templateQuote) return index + 1;
    if (source[index] === "$" && source[index + 1] === "{") {
      index = readTemplateExpression(source, index + 2);
      continue;
    }
    index += 1;
  }
  return source.length;
}

function isWord(character) {
  return Boolean(character) && /[A-Za-z0-9_$]/.test(character);
}

function requiresSeparator(left, right) {
  if (isWord(left) && isWord(right)) return true;
  return (
    (left === "+" && right === "+") ||
    (left === "-" && right === "-") ||
    (left === "/" && right === "/") ||
    (left === "*" && right === "/") ||
    (left === "/" && right === "*")
  );
}

function minifyJavaScript(source) {
  let output = "";
  let pendingSpace = false;
  let lastSignificant = "";
  let index = 0;
  while (index < source.length) {
    const character = source[index];
    if (character === "'" || character === '"') {
      if (pendingSpace && requiresSeparator(lastSignificant, character))
        output += " ";
      const end = readQuoted(source, index, character);
      output += source.slice(index, end);
      lastSignificant = source[end - 1] || lastSignificant;
      pendingSpace = false;
      index = end;
      continue;
    }
    if (character === templateQuote) {
      if (pendingSpace && requiresSeparator(lastSignificant, character))
        output += " ";
      const end = readTemplate(source, index);
      output += source.slice(index, end);
      lastSignificant = templateQuote;
      pendingSpace = false;
      index = end;
      continue;
    }
    if (/\s/.test(character)) {
      pendingSpace = true;
      index += 1;
      continue;
    }
    if (character === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      pendingSpace = true;
      index = end < 0 ? source.length : end + 2;
      continue;
    }
    if (character === "/" && source[index + 1] === "/") {
      const end = source.indexOf("\n", index + 2);
      pendingSpace = true;
      index = end < 0 ? source.length : end + 1;
      continue;
    }
    if (pendingSpace && requiresSeparator(lastSignificant, character))
      output += " ";
    output += character;
    lastSignificant = character;
    pendingSpace = false;
    index += 1;
  }
  return output.trim();
}

function minifyCss(source) {
  let output = "";
  let pendingSpace = false;
  let index = 0;
  while (index < source.length) {
    const character = source[index];
    if (character === "'" || character === '"') {
      if (pendingSpace) output += " ";
      const end = readQuoted(source, index, character);
      output += source.slice(index, end);
      pendingSpace = false;
      index = end;
      continue;
    }
    if (character === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      pendingSpace = true;
      index = end < 0 ? source.length : end + 2;
      continue;
    }
    if (/\s/.test(character)) {
      pendingSpace = true;
      index += 1;
      continue;
    }
    if (pendingSpace && !/[{}:;,>+~]/.test(character)) {
      const previous = output[output.length - 1] || "";
      if (previous && !/[{}:;,>+~]/.test(previous)) output += " ";
    }
    if (/[{}:;,>+~]/.test(character)) output = output.replace(/\s+$/, "");
    output += character;
    pendingSpace = false;
    index += 1;
  }
  return output.trim();
}

function minifyHtml(source) {
  const blocks = [];
  const protectedSource = source.replace(
    /<(script|style|textarea|pre)([^>]*)>[\s\S]*?<\/\1>/gi,
    (full, tag) => {
      const blockIndex = blocks.push({ full, tag: tag.toLowerCase() }) - 1;
      if (tag.toLowerCase() === "script") {
        const content = full.match(/<script([^>]*)>([\s\S]*?)<\/script>/i);
        blocks[blockIndex].full =
          "<script" +
          (content[1] || "") +
          ">" +
          minifyJavaScript(content[2] || "") +
          "</script>";
      } else if (tag.toLowerCase() === "style") {
        const content = full.match(/<style([^>]*)>([\s\S]*?)<\/style>/i);
        blocks[blockIndex].full =
          "<style" +
          (content[1] || "") +
          ">" +
          minifyCss(content[2] || "") +
          "</style>";
      }
      return "__POKEBAZAR_BLOCK_" + blockIndex + "__";
    },
  );
  let output = protectedSource
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
  blocks.forEach((block, index) => {
    output = output.replace("__POKEBAZAR_BLOCK_" + index + "__", block.full);
  });
  return output;
}

const source = fs.readFileSync(sourcePath, "utf8");
const output = minifyHtml(source);
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, output + "\n", "utf8");
fs.writeFileSync(path.join(outputDirectory, ".nojekyll"), "", "utf8");
console.log(
  "GitHub Pages bundle:",
  source.length,
  "bytes ->",
  output.length,
  "bytes",
);
