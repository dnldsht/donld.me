import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
} from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({

  presets: [
    presetIcons(),
    presetWind3(),
    presetAttributify(),
    presetWebFonts(
      {
        provider: 'fontshare',
        fonts: {
          sans: 'Satoshi',
          serif: 'GroteskBold',
        },
      },
    ),
    presetTypography(),
  ],
  shortcuts: [
    {
      defaultDark: 'dark:bg-black dark:text-gray-2',
      defaultLight: 'bg-white text-black ',
      defaultBorder: 'dark:border-dark-2 border-gray-2 ',
      defaultLayer: 'w-5/6 lg:w-1/2 xl:w-2/5',
      defaultLink: 'block decoration-none border-b border-gray-3 dark:border-dark-1 hover:border-gray-8 dark:hover:border-gray-3',
      MdLink: 'decoration-none border-b hover:border-gray-3 dark:hover:border-dark-1 border-gray-8 dark:border-gray-3',
    },
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    animation: {
      keyframes: {
        slideInUp: '{ from {transform: translateY(10px);opacity:0;} to {transform: translateY(0px);opacity:100;}}',
      },
      durations: {
        slideInUp: '0.8s',
      },
      timingFns: {
        slideInUp: 'ease',
      },
    },
  },

})
