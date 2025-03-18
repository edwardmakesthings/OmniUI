import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming';
import "../src/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'dark', value: '#151515' },
        { name: 'light', value: '#f9f9f9' },
      ],
      default: 'dark',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
    layout: 'centered',
  },
};

export default preview;