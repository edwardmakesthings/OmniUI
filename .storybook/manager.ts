import { addons } from '@storybook/manager-api';
import omniUITheme from './omniUITheme';

// Configure Storybook UI theme
addons.setConfig({
    theme: omniUITheme,
});