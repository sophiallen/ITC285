module.exports = {
  "parser": 'babel-eslint',
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [ "react" ],
  "rules": {
    "quotes": ["error","single"],
    "prefer-arrow-callback":"warn",
    "no-var":"error",
    "semi": ["error","always"],
    "no-console": ["warn", { "allow": ["info", "error"] }]
  }
};
