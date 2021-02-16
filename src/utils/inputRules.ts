import {
  InputRule,
  textblockTypeInputRule,
  wrappingInputRule,
} from 'prosemirror-inputrules';
import schema from './schema';
import markInputRule from './markInputRule';
import { level } from 'chalk';

function createInputRules() {
  let inputRules = [];

  const strong = markInputRule(/(?:\*\*)([^*]+)(?:\*\*)$/, schema.marks.strong);
  inputRules.push(strong);

  const em = markInputRule(/(?:\*)([^*]+)(?:\*)$/, schema.marks.em);
  inputRules.push(em);

  const underline = markInputRule(
    /(?:__)([^_]+)(?:__)$/,
    schema.marks.underline,
  );
  inputRules.push(underline);

  const strikethrough = markInputRule(
    /(?:~~)([^~]+)(?:~~)$/,
    schema.marks.strikethrough,
  );
  inputRules.push(strikethrough);

  // marks
  const code = markInputRule(/(?:^|[^`])(`([^`]+)`)$/, schema.marks.code);
  inputRules.push(code);

  // link
  const link = new InputRule(/\[(.+)]\((\S+)\)/, (state, match, start, end) => {
    const [okay, alt, href] = match;
    const { tr } = state;

    if (okay) {
      tr.replaceWith(start, end, schema.text(alt)).addMark(
        start,
        start + alt.length,
        schema.marks.link.create({ href }),
      );
    }

    return tr;
  });
  inputRules.push(link);

  // Heading
  for (let level = 1; level <= 6; level++) {
    const heading = textblockTypeInputRule(
      new RegExp(`^(#{1,${level}})\\s$`),
      schema.nodes.heading,
      { level },
    );

    inputRules.push(heading);
  }

  // Blockquote
  const blockquote = wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote);
  inputRules.push(blockquote);

  return inputRules;
}

export default createInputRules;
