const flowbite = require("flowbite-react/tailwind");

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  "field": {
    "base": "relative w-full"
  },
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      width: {
        default: '800px',
        DEFAULT: '800px'
      },
      padding: {
        DEFAULT: '24px',
        sm: '4rem',
        lg: '20%',
        xl: '20%',
        '2xl': '20%',
      },
    },
    extend: {

      colors: {
        lime: {
          1000: '#CCFF3A',
        },
        primary: {
          50: "#eef2ff",
          "100": "#e0e7ff",
          "200": "#c7d2fe",
          "300": "#a5b4fc",
          "400": "#818cf8",
          "500": "#6366f1",
          "600": "#4f46e5",
          "700": "#4338ca",
          "800": "#3730a3",
          "900": "#5C3CFA",
          "950": "#1e1b4b",
          "1000": '#3200B9',
        },
        gray: {
          25: "#FDFDFD",
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E9EAEB",
          300: "#D5D7DA",
          400: "#A4A7AE",
          500: "#717680",
          600: "#535862",
          700: "#414651",
          800: "#252B37",
          900: "#101828"
        },
        red: {
          25: "#FFFBFA",
          50: "#FEF3F2",
          100: "#FEE4E2",
          200: "#FECDCA",
          300: "#FDA29B",
          400: "#F97066",
          500: "#F04438",
          600: "#D92D20",
          700: "#B42318",
          800: "#912018",
          900: "#7A271A"
        },
        yellow: {
          25: "#FFFCF5",
          50: "#FFFAEB",
          100: "#FEF0C7",
          200: "#FEDF89",
          300: "#FEC84B",
          400: "#FDB022",
          500: "#F79009",
          600: "#DC6803",
          700: "#B54708",
          800: "#93370D",
          900: "#7A2E0E"
        },
        green: {
          25: "#F6FEF9",
          50: "#ECFDF3",
          100: "#D1FADF",
          200: "#A6F4C5",
          300: "#6CE9A6",
          400: "#32D583",
          500: "#12B76A",
          600: "#039855",
          700: "#027A48",
          800: "#05603A",
          900: "#054F31"
        }
      },
      fontFamily: {
        sans: [
          'PPMori',
        ]
      }
    },
    fontFamily: {
      ppmori: ['PPMori', 'sans-serif'],
      'body': [
        'PPMori',
      ],
      'sans': [
        'PPMori',
      ]
    }
  },
  plugins: [
    flowbite.plugin(),
  ],
};
export default config;
