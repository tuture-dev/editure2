import { InputRule } from 'prosemirror-inputrules';
import schema from './schema';
import markInputRule from './markInputRule';

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

  return inputRules;
}

export default createInputRules;
