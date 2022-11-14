const autoprefixer = require("autoprefixer");
const tailwind = require("tailwindcss");
const nesting = require("tailwindcss/nesting");
const tailwindConfig = require("./tailwind.config");

// https://tailwindcss.com/docs/using-with-preprocessors
module.exports = {
  plugins: [nesting, tailwind(tailwindConfig), autoprefixer],
};
