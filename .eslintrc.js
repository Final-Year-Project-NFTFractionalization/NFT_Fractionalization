module.exports = {
    parser: "@babel/eslint-parser",
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    env: {
      node: true,
      es2022: true,
    },
    plugins: [],
    extends: ["eslint:recommended"],
    rules: {
      // Add specific rules as needed
    },
  };