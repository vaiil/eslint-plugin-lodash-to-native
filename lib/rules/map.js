/**
 * @fileoverview _.map to Array.map
 * @author Aleksey Orlov
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: '_.map to Array.map',
      category: 'Fill me in',
      recommended: false
    },
    messages: {
      useNativeMapMethod: 'Use native Array.map method'
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {

    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'MemberExpression[object.name="_"][property.name="map"]' (node) {
        const error = { messageId: 'useNativeMapMethod', node }
        console.log(node)
        context.report(error)
      }
    }
  }
}
