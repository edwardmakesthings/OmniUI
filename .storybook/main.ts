import type { StorybookConfig } from '@storybook/react-vite';
import { themes } from '@storybook/theming';
import path from "path";

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: async (config) => {
    config.base = "/OmniUI/storybook/";
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, "../src"),
      };
    }
    return config;
  },

  // Static files directory configuration
  staticDirs: ['../public'],

  // Ensure Storybook works in a subdirectory
  managerHead: (head) => `
    ${head}
    <script>
      window.STORYBOOK_BASE_PATH = '/OmniUI/storybook/';
    </script>
  `
};

export default config;