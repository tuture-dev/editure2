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

  // marks
  const code = markInputRule(/(?:^|[^`])(`([^`]+)`)$/, schema.marks.code);
  inputRules.push(code);

  return inputRules;
}

export default createInputRules;
