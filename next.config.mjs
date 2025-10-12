/** @type {import('next').NextConfig} */
const nextConfig = {
  // Handle ESM packages like @react-pdf/renderer
  serverExternalPackages: ['@react-pdf/renderer'],
  webpack: (config) => {
    // For pdf renderer - disable canvas and encoding dependencies
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Add support for @react-pdf/renderer
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    });
    
    // Using direct module paths instead of require.resolve
    config.resolve.alias['@babel/runtime-corejs3/helpers/extends'] = 
      './node_modules/@babel/runtime-corejs3/helpers/esm/extends.js';
    
    config.resolve.alias['@babel/runtime-corejs3/helpers/inheritsLoose'] = 
      './node_modules/@babel/runtime-corejs3/helpers/esm/inheritsLoose.js';
    
    config.resolve.alias['@babel/runtime-corejs3/core-js-stable/instance/slice'] = 
      './node_modules/@babel/runtime-corejs3/core-js-stable/instance/slice.js';
    
    config.resolve.alias['@babel/runtime-corejs3/core-js-stable/instance/filter'] = 
      './node_modules/@babel/runtime-corejs3/core-js-stable/instance/filter.js';
    return config;
  }
};

export default nextConfig;
