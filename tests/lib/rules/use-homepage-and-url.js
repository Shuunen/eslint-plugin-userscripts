var rule = require('..')['use-homepage-and-url'];
var RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('use-homepage-and-url', rule, {
  valid: [
    `// ==UserScript==
    // @homepage example.com
    // @homepageURL example.com
    // ==/UserScript==`
  ],
  invalid: [
    {
      code: `// ==UserScript==
      // @homepage example.com
      // ==/UserScript==`,
      errors: [
        {
          messageId: 'missingAttribute',
          data: { attribute: 'homepageURL' }
        }
      ],
      output: `// ==UserScript==
      // @homepage example.com
      // @homepageURL example.com
      // ==/UserScript==`
    },
    {
      code: `// ==UserScript==
      // @homepageURL example.com
      // ==/UserScript==`,
      errors: [
        {
          messageId: 'missingAttribute',
          data: { attribute: 'homepage' }
        }
      ],
      output: `// ==UserScript==
      // @homepageURL example.com
      // @homepage example.com
      // ==/UserScript==`
    }
  ]
});
