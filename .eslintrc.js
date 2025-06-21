**Configuración ESLint Mejorada y Optimizada:**

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2022,  // Versión explícita de ECMAScript
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties'  // Soporte para propiedades de clase
      ]
    },
    extraFileExtensions: ['.vue']  // Mejor detección de archivos
  },
  rules: {
    // Reglas de Vue
    'vue/multi-word-component-names': 'off',
    'vue/component-tags-order': ['error', {
      order: ['script[setup]', 'script', 'template', 'style']
    }],
    'vue/component-api-style': ['error', ['script-setup']],  // Fomenta Composition API
    'vue/html-closing-bracket-newline': ['error', {  // Formato de cierre de tags
      singleline: 'never',
      multiline: 'always'
    }],

    // Reglas JavaScript
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],  // Ignora variables con _
    'no-implied-eval': 'error',
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-var': 'error',  // Fomenta uso de let/const

    // Estilo de código
    'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'semi': ['error', 'always'],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'comma-dangle': ['error', 'only-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'keyword-spacing': ['error', { before: true }],  // Espaciado para keywords

    // Mejores prácticas
    'eqeqeq': ['error', 'smart'],  // Permite comparaciones inteligentes (== null)
    'curly': ['error', 'multi-line'],  // Más flexible para bloques multi-línea
    'prefer-const': 'warn',
    'template-curly-spacing': ['error', 'never']  // Espaciado en template literals
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'indent': 'off',
        'vue/html-indent': ['error', 2, {
          attribute: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: ['pre']  // Excepciones para elementos específicos
        }],
        'vue/script-indent': ['error', 2, {
          baseIndent: 1,
          switchCase: 1
        }],
        'vue/max-attributes-per-line': ['error', {  // Formato de atributos
          singleline: 5,
          multiline: 1
        }]
      }
    },
    {
      files: ['**/*.spec.js'],
      env: {
        jest: true  // Variables globales de testing
      }
    }
  ],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',  // Nuevos macros de Vue 3
    withDefaults: 'readonly'
  }
};
```

**Mejoras Clave:**

1. **Soporte para Vue 3 Actualizado:**
   - Eliminada regla deprecated `vue/script-setup-uses-vars` (ahora incluida en el plugin)
   - Nuevas reglas para Composition API (`vue/component-api-style`)
   - Agregados nuevos macros globales (`defineExpose`, `withDefaults`)

2. **Configuración de Parser Mejorada:**
   - Versión explícita de ECMAScript 2022
   - Soporte para propiedades de clase en Babel
   - Extensión explícita para archivos `.vue`

3. **Reglas de Formato Mejoradas:**
   - Adición de `vue/html-closing-bracket-newline` para mejor formato de HTML
   - Regla `keyword-spacing` para consistencia en keywords
   - Manejo de atributos en múltiples líneas (`vue/max-attributes-per-line`)

4. **Flexibilidad en Reglas:**
   - `eqeqeq` permite `== null` para checks de null/undefined
   - Ignora variables no usadas que empiezan con `_`
   - Reglas de indentación más específicas para bloques `switch`

5. **Soporte para Testing:**
   - Configuración automática de variables Jest en archivos `.spec.js`

6. **Mejor Manejo de Templates:**
   - Regla `template-curly-spacing` para template literals
   - Excepciones para elementos `<pre>` en indentación HTML

**Para usar esta configuración, asegúrate de tener las dependencias necesarias:**
```bash
npm install -D eslint vue-eslint-parser @babel/eslint-parser eslint-plugin-vue
```