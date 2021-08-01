const createValidator = require('../utils/createValidator');

module.exports = createValidator(
  'description',
  true,
  (attrVal, index, indexMatch, metadata, context) => {
    if (index > 0) {
      context.report({
        loc: attrVal.loc,
        messageId: 'multipleDescriptions'
      });
    }
  },
  {
    multipleDescriptions: 'Include only one description'
  }
);