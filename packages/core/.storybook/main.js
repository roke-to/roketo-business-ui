const { mergeConfig } = require("vite");
const svgr = require("vite-plugin-svgr");

const postcss = require("./custom-configs/postcss.config");

module.exports = {
  stories: ["../**/*.stories.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true,
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [svgr()],
      css: { postcss },
    });
  },
};
