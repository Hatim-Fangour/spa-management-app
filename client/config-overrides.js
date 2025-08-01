const JavaScriptObfuscator = require("webpack-obfuscator");

module.exports = function override(config, env) {
  if (env === "production") {
    config.plugins.push(
      new JavaScriptObfuscator(
        {
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['base64'], // hides strings
          compact: true,
          deadCodeInjection: true,
          controlFlowFlattening: true, // makes logic unreadable
          selfDefending: true,
        },
        ["excluded_bundle_name.js"] // leave empty unless needed
      )
    );
  }
  return config;
};
