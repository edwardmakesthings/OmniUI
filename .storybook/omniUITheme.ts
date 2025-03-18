import { create } from '@storybook/theming/create';

export default create({
    base: 'dark',

    // Brand
    brandTitle: 'OmniUI',
    brandUrl: 'https://github.com/edwardmakesthings/OmniUI',
    brandImage: '../.storybook/omniui_storybook.svg',
    brandTarget: '_self',

    // Colors
    colorPrimary: '#e8ae65', // Customize with your primary brand color
    colorSecondary: '#1E88E5',

    // UI
    appBg: '#242424',
    appContentBg: '#151515',
    appPreviewBg: '#151515',
    appBorderColor: '#333333',
    appBorderRadius: 8,

    // Text colors
    textColor: '#F7FAFC',
    textInverseColor: '#1A202C',

    // Toolbar default and active colors
    barTextColor: '#A0AEC0',
    barSelectedColor: '#e8ae65',
    barBg: '#2a2a2a',

    // Form colors
    inputBg: '#2D3748',
    inputBorder: '#4A5568',
    inputTextColor: '#F7FAFC',
    inputBorderRadius: 4,
});