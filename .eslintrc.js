module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', 'import', 'unused-imports', '@typescript-eslint', 'prettier'],
  env: {
    es6: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'none',
        bracketSpacing: true,
        arrowParens: 'avoid',
        objectPropertyNewline: true,
        objectCurlyNewline: {
          multiline: true,
          minProperties: 2
        }
      }
    ],
    'no-await-in-loop': 2,
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'react/no-unstable-nested-components': 'off',
    'react-hooks/exhaustive-deps': ['warn'],
    'import/order': [
      'warn',
      {
        pathGroups: [
          {
            pattern: '**/*',
            group: 'parent'
          }
        ],
        groups: ['external', 'builtin', 'parent', 'sibling', 'index', 'type', 'object'],
        'newlines-between': 'always'
      }
    ],
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off'
  },
  overrides: [
    {
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'no-undef': 'off'
      }
    },
    {
      files: ['**/__tests__/**/*', '**/*.test.{ts,tsx,js,jsx}'],
      env: {
        jest: true
      }
    }
  ]
}
