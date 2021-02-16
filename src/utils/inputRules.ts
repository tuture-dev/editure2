import schema from './schema';
import markInputRule from './markInputRule';

function createInputRules() {
  let inputRules = [];

  // marks
  const code = markInputRule(/(?:^|[^`])(`([^`]+)`)$/, schema['marks']['code']);
  inputRules.push(code);

  return inputRules;
}

export default createInputRules;
