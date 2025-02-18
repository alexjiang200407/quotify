import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['resources/vara', 'public'],
  rules: { 'func-style': ['error', 'expression', { allowArrowFunctions: true }], 'antfu/top-level-function': 'off' },
})
