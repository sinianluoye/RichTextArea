module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // Turn off the rule
    // You can add other rules here
    'react-hooks/rules-of-hooks': 'off',
  },
};
