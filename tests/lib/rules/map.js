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
    },
    {
      code: 'if(!Array.isArray(a)){_.map(a, f)}'
    },
    {
      code: 'a instanceof Array ? a.map(f) : _.map(a, f)'
    },
    {
      code: 'if(!(a instanceof Array)){ _.map(a, f)}'
    },
    {
      code: '_.map({}, f)'
    }
  ],

  invalid: [
    {
      code: '_.map([], function(){})',
      errors: [{
        messageId: 'useNativeMapMethod'
      }],
      output: '([].map(function(){}))'
    },
    {
      code: 'var a = _.map([], function(){})',
      errors: [{
        messageId: 'useNativeMapMethod'
      }],
      output: 'var a = [].map(function(){})'
    },
    {
      code: 'if(a instanceof Array){_.map(a, function(){})}',
      errors: [{
        messageId: 'useNativeMapMethod'
      }],
      output: 'if(a instanceof Array){a.map(function(){})}'
    },
    {
      code: '_.map(a, b)',
      errors: [{
        messageId: 'useNativeMapMethod'
      }],
      output: '(Array.isArray(a) ? a.map(b) : _.map(a, b))'
    }
  ]
})
