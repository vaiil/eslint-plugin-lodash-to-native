/**
 * @fileoverview _.map to Array.map
 * @author Aleksey Orlov
 */
'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const
  rule = require('../../../lib/rules/map'),
  RuleTester = require('eslint').RuleTester

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('map', rule, {

  valid: [
    {
      code: 'Array.isArray(a) ? a.map(f) : _.map(a, f)'
    }
  ],

  invalid: [
    {
      code: '_.map([], function(){})',
      errors: [{
        messageId: 'useNativeMapMethod'
      }],
      output: '[].map(function(){})'
    }
  ]
})
