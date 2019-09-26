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
    const sourceCode = context.getSourceCode()
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function fixToArrayMethod (node, fixer) {
      const arrayCode = sourceCode.getText(node.arguments[0])
      const callbackCode = sourceCode.getText(node.arguments[1])
      return fixer.replaceText(node, `${arrayCode}.map(${callbackCode})`)
    }

    function fixWithCheck (node, fixer) {
      const arrayCode = sourceCode.getText(node.arguments[0])
      const callbackCode = sourceCode.getText(node.arguments[1])
      return [
        fixer.insertTextBefore(node, `(Array.isArray(${arrayCode}) ? ${arrayCode}.map(${callbackCode}) : `),
        fixer.insertTextAfter(node, `)`)
      ]
    }

    function resolveNegativeCondition (expression) {
      function resolver ({ expression, reverseCondition }) {
        if (
          expression.type === 'UnaryExpression'
          && expression.operator === '!'
        ) {
          return resolver({ expression: expression.argument, reverseCondition: !reverseCondition })
        }
        return { expression, reverseCondition }
      }

      return resolver({ expression, reverseCondition: false })

    }

    /**
     * @param expression
     * @param variable
     * @return {boolean}
     */
    function doesExpressionCheckArray (expression, variable) {
      // Array.isArray()
      if (
        expression.type === 'CallExpression'
        && expression.callee.object.name === 'Array'
        && expression.callee.property.name === 'isArray'
        && expression.arguments.length === 1
        && expression.arguments[0].type === 'Identifier'
        && expression.arguments[0].name === variable.name
      ) {
        return true
      }

      // Instance of
      return expression.type === 'BinaryExpression'
        && expression.operator === 'instanceof'
        && expression.left.type === 'Identifier'
        && expression.left.name === variable.name
        && expression.right.type === 'Identifier'
        && expression.right.name === 'Array';
    }

    /**
     * Looking for array checks. If it is positive check returns true, negative - false, variable is not checkin - null
     * @param variable
     * @return {null|boolean}
     */
    function checkIsArray (variable) {
      let node = variable
      while (node.parent) {
        if (node.parent.type === 'ConditionalExpression' || node.parent.type === 'IfStatement') {
          const { expression, reverseCondition } = resolveNegativeCondition(node.parent.test)
          if (doesExpressionCheckArray(expression, variable)) {
            return (node === node.parent.consequent) !== reverseCondition
          }
        }
        //TODO check if variable sets value
        node = node.parent
      }
      return null
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'CallExpression[callee.object.name="_"][callee.property.name="map"]' (node) {
        const error = { messageId: 'useNativeMapMethod', node }

        // Fix only if two arguments
        if (node.arguments.length === 2) {
          switch (node.arguments[0].type) {
            case 'ArrayExpression':
              error.fix = fixToArrayMethod.bind(this, node)
              break
            case 'ObjectExpression':
              return
            case 'Identifier':
              const isArray = checkIsArray(node.arguments[0])
              if (isArray === false) {
                return
              } else if (isArray === true) {
                error.fix = fixToArrayMethod.bind(this, node)
              } else {
                error.fix = fixWithCheck.bind(this, node)
              }
              break
          }
        }

        context.report(error)
      }
    }
  }
}
