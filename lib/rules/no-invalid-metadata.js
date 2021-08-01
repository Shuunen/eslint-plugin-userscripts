module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'ensure userscripts have valid metadata',
      category: 'Possible Errors'
    },
    messages: {
      metadataRequired: 'Add metadata to the userscript',
      moveMetadataToTop: 'Move the metadata to the top of the file',
      noClosingMetadata: 'Closing metadata comment not found',
      noCodeBetween: 'Code found between in metadata',
      attributeNotStartsWithAtTheRate: 'Attributes should begin with @'
    },
    schema: [
      {
        type: 'object',
        properties: {
          top: {
            enum: ['required', 'optional'],
            default: 'required'
          }
        },
        additionalProperties: false
      }
    ]
  },
  create: (context) => {
    const sourceCode = context.getSourceCode();

    const comments = sourceCode.getAllComments();
    const lines = sourceCode.lines;

    let inMetadata = false;
    let done = false;
    lines.forEach((line, index) => {
      if (done) {
        return;
      }

      const lineLoc = {
        start: {
          line: index + 1,
          column: 0
        },
        end: {
          line: index + 1,
          column: line.length
        }
      };

      if (inMetadata && !line.trim().startsWith('//')) {
        context.report({ loc: lineLoc, messageId: 'noCodeBetween' });
      } else if (
        inMetadata &&
        line.trim().startsWith('//') &&
        line.trim().slice(2).trim() === '==/UserScript=='
      ) {
        done = true;
      } else if (
        !inMetadata &&
        line.trim().startsWith('//') &&
        line.trim().slice(2).trim() === '==UserScript=='
      ) {
        inMetadata = true;
      } else if (inMetadata && !line.trim().slice(2).trim().startsWith('@')) {
        context.report({
          loc: lineLoc,
          messageId: 'attributeNotStartsWithAtTheRate'
        });
      }
    });

    return {
      Program(node) {
        if (
          comments.length === 0 ||
          !comments.find(
            (comment) =>
              comment.value.trim() === '==UserScript==' &&
              comment.type === 'Line'
          )
        ) {
          context.report({
            node,
            messageId: 'metadataRequired'
          });
        } else if (
          !comments.find(
            (comment) =>
              comment.value.trim() === '==/UserScript==' &&
              comment.type === 'Line'
          )
        ) {
          context.report({
            loc: comments[0].loc,
            messageId: 'noClosingMetadata'
          });
        }
        if (
          (!context.options[0] ||
            !context.options[0].top ||
            context.options[0].top === 'required') &&
          (comments[0].value.trim() !== '==UserScript==' ||
            comments[0].loc.start.line !== 1)
        ) {
          context.report({
            loc: comments.find(
              (comment) =>
                comment.value.trim() === '==UserScript==' &&
                comment.type === 'Line'
            ).loc,
            messageId: 'moveMetadataToTop'
          });
        }
      }
    };
  }
};