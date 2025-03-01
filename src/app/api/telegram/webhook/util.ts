import { type Node } from "@/app/actions/db/workflow/get";

export const adjustBotNodes = (nodes: Node[]): Node[] => {
  // keep track of the output numbers
  let counter = 0;
  // map nodes
  return nodes.map((node) => {
    switch (node.type) {
      case "botInput":
        return { ...node, type: "APIInput", data: { name: "botInput" } };
      case "botOutput":
        return {
          ...node,
          type: "APIOutput",
          data: { name: `botOutput${counter++}` },
        };
      default:
        return node;
    }
  });
};

const MAX_MESSAGE_LENGTH = 4096; // Telegram's message length limit

/**
 * Recursively splits a message into chunks that fit within Telegram's message length limit
 * using increasingly granular splitting methods:
 * 1. Split by paragraphs
 * 2. Split by sentences
 * 3. Split by words
 * 4. Split by characters
 */
export function chunkMessage(message: string): string[] {
  if (!message) return [];
  if (message.length <= MAX_MESSAGE_LENGTH) return [message];

  // Try splitting by paragraphs first
  const paragraphChunks = splitByDelimiter(message, "\n\n");
  if (paragraphChunks.every((chunk) => chunk.length <= MAX_MESSAGE_LENGTH)) {
    return paragraphChunks;
  }

  // If paragraph splitting didn't work, try sentences
  const sentenceChunks = paragraphChunks.flatMap((chunk) => {
    if (chunk.length <= MAX_MESSAGE_LENGTH) return [chunk];
    return splitByDelimiter(chunk, /[.!?]\s+/);
  });
  if (sentenceChunks.every((chunk) => chunk.length <= MAX_MESSAGE_LENGTH)) {
    return sentenceChunks;
  }

  // If sentence splitting didn't work, try words
  const wordChunks = sentenceChunks.flatMap((chunk) => {
    if (chunk.length <= MAX_MESSAGE_LENGTH) return [chunk];
    return splitByDelimiter(chunk, " ");
  });
  if (wordChunks.every((chunk) => chunk.length <= MAX_MESSAGE_LENGTH)) {
    return wordChunks;
  }

  // If all else fails, split by characters
  return wordChunks.flatMap((chunk) => {
    if (chunk.length <= MAX_MESSAGE_LENGTH) return [chunk];
    const charChunks: string[] = [];
    for (let i = 0; i < chunk.length; i += MAX_MESSAGE_LENGTH) {
      charChunks.push(chunk.slice(i, i + MAX_MESSAGE_LENGTH));
    }
    return charChunks;
  });
}

/**
 * Helper function to split text by a delimiter and ensure each chunk maintains context
 */
function splitByDelimiter(text: string, delimiter: string | RegExp): string[] {
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  const parts = text.split(delimiter);

  for (const part of parts) {
    // Add delimiter back except for RegExp splits which need a space
    const delimiter_str = typeof delimiter === "string" ? delimiter : " ";
    const partWithDelimiter = part + delimiter_str;

    if (currentLength + partWithDelimiter.length <= MAX_MESSAGE_LENGTH) {
      currentChunk.push(partWithDelimiter);
      currentLength += partWithDelimiter.length;
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(""));
      }
      currentChunk = [partWithDelimiter];
      currentLength = partWithDelimiter.length;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(""));
  }

  return chunks;
}

export const VIOLATION_PATTERN = new RegExp(
  "(?:\\[[^\\]]*\\]\\((?:\\\\.|[^)\\\\])*(?<!\\\\)(?<insideViolation>[)\\\\])(?:\\\\.|[^)\\\\])*\\)" +
    "|" +
    "(?<!\\\\)(?<outsideViolation>[_*\\[\\]\\(\\)~`>#+\\-=|{}\\.!]))",
  "g",
);

/**
 * Insert a backslash before any violation
 * so the text "conforms" to the required escaping rules.
 */
export function sanitizeMarkdown(input: string): string {
  // Make sure we start fresh each time.
  VIOLATION_PATTERN.lastIndex = 0;

  let output = input;
  let match: RegExpExecArray | null;

  // We’ll loop until no more violations are found
  while ((match = VIOLATION_PATTERN.exec(output)) !== null) {
    // The full match is match[0], but we really care about the named groups:
    const { insideViolation, outsideViolation } = match.groups ?? {};

    // Which character is unescaped? It might be inside or outside parentheses.
    const violationChar = insideViolation ?? outsideViolation;
    if (!violationChar) {
      // Shouldn't happen if our pattern is correct; just break to avoid infinite loop
      break;
    }

    // Where did we find that violation?
    const startIndex = match.index;

    // If it was an inside-link violation, the entire matched substring includes
    // the bracket [ ... ]( ... ), so we need to find exactly where the violationChar
    // occurs within match[0].
    //
    // Alternatively, we can compute the exact index of the group using:
    const violationAbsoluteIndex = startIndex + match[0].indexOf(violationChar);

    // Insert the missing '\'
    output =
      output.slice(0, violationAbsoluteIndex) +
      "\\" + // the fix
      output.slice(violationAbsoluteIndex);

    // Reset lastIndex so we don't skip anything after insertion
    // Move one past the newly inserted character.
    VIOLATION_PATTERN.lastIndex = violationAbsoluteIndex + 2;
  }

  return output;
}
