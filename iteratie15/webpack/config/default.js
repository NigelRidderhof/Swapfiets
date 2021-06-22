const path = require('path');

const BASE_PATH = path.resolve(__dirname, '../..');

const PUBLIC_FOLDER = 'TheBlueTire';

const THEME_FOLDER = `${process.env.NODE_THEME ? `${process.env.NODE_THEME}/` : ''}`;

const DEFAULT_CONFIG = {
  /**
   * Debug mode (true|false). Should be disabled on production builds
   */
  debug: true,

  /**
   * Public folder prefix. This is usually the private path prefixed with /web or /public
   */
  public: `/build/${THEME_FOLDER}`,

  /**
   * Private build folder
   */
  private: `${BASE_PATH}/${PUBLIC_FOLDER}/build/${THEME_FOLDER}`,

  /**
   * Manifest file name
   */
  manifestFile: 'manifest.json',

  /**
   * The base entry files that have to go through the loader
   */
  entries: {
    'js-app': `${BASE_PATH}/assets/${THEME_FOLDER}js/app.js`,
    'js-outdated-browser': `${BASE_PATH}/assets/${THEME_FOLDER}js/outdated.js`,
    'css-main': `${BASE_PATH}/assets/${THEME_FOLDER}css/styles.scss`,
  },

  /**
   * Registered and enabled plugins, executed IN order
   */
  enabledPlugins: [
    'cleaner',
    'css',
    'js',
    'mjml',
    'svg',
    'misc',
  ],

  /**
   * Components
   */
  components: {
    /**
     * Cleaner: Clean build folder prior to a new build
     */
    cleaner: {
      pattern: ['**/*', '!svg*', '!manifest.json'],
      watchPattern: ['!svg*', '!manifest.json'],
    },

    /**
     * MJML: Email framework
     */
    mjml: {
      extension: '.twig',
      source: `${BASE_PATH}/assets/${THEME_FOLDER}mjml/`,
      dist: `${BASE_PATH}/${PUBLIC_FOLDER}/build/${THEME_FOLDER}mjml/`,
    },

    /**
     * Javascript (ES6)
     */
    js: {
      source: `${BASE_PATH}/assets/${THEME_FOLDER}js/`,
      dist: `${BASE_PATH}/${PUBLIC_FOLDER}/build/${THEME_FOLDER}js/`,
      fileMask: 'js/[name].build.js?v=[contenthash:6]',
    },

    /**
     * CSS with SCSS
     */
    css: {
      source: `${BASE_PATH}/assets/${THEME_FOLDER}css/`,
      dist: `${BASE_PATH}/${PUBLIC_FOLDER}/build/${THEME_FOLDER}css/`,
      fileMask: 'css/[name].build.css?h=[contenthash:6]',
    },

    /**
     * SVG sprites
     */
    svg: {
      source: `${BASE_PATH}/assets/${THEME_FOLDER}svg/`,
      dist: `${BASE_PATH}/${PUBLIC_FOLDER}/build/${THEME_FOLDER}svg/`,
    },
  },
};

module.exports = DEFAULT_CONFIG;
