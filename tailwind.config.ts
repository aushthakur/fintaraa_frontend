// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      borderRadius: {
        'sm': '0px',
        DEFAULT: '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
      },
      maxWidth: {
        "6xl": "72rem", // 1152px
        "7xl": "80rem", // 1280px
        "8xl": "90rem", // 1440px
        "9xl": "100rem", // 1600px
      },
    },
  },
};

export default config;
