module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": false,
    "os": false
  };
  
  // Disable source-map-loader for timeago.js completely
  config.module.rules = config.module.rules.map(rule => {
    if (rule.test && rule.test.toString().includes('source-map')) {
      return {
        ...rule,
        enforce: 'pre',
        exclude: [
          /node_modules\/timeago\.js/,
          /node_modules\/@babel\/runtime/,
          /node_modules\/core-js/
        ]
      };
    }
    return rule;
  });

  // Add rule to ignore source maps for timeago.js
  config.module.rules.unshift({
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules\/timeago\.js/,
    use: ['source-map-loader']
  });

  return config;
};
