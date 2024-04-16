/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  daisyui: {
    themes: [
      {
        light: {
          primary: "#BD93F9",
          "primary-content": "#282A36",
          secondary: "#BD93F9",
          "secondary-content": "#282A36",
          accent: "#FF79C6",
          "accent-content": "#282A36",
          neutral: "#282A36",
          "neutral-content": "#F8F8F2",
          "base-100": "#F8F8F2",
          "base-200": "#EDF0F3",
          "base-300": "#8BE9FD",
          "base-content": "#282A36",
          info: "#BD93F9",
          success: "#50FA7B",
          warning: "#FFB86C",
          error: "#FF5555",
    
          "--rounded-btn": "9999rem",
    
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#282A36",
          "primary-content": "#F8F8F2",
          secondary: "#44475A",
          "secondary-content": "#F8F8F2",
          accent: "#6272A4",
          "accent-content": "#F8F8F2",
          neutral: "#F8F8F2",
          "neutral-content": "#6272A4",
          "base-100": "#6272A4",
          "base-200": "#3D4257",
          "base-300": "#282A36",
          "base-content": "#F8F8F2",
          info: "#6272A4",
          success: "#50FA7B",
          warning: "#FFB86C",
          error: "#FF5555",
    
          "--rounded-btn": "9999rem",
    
          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
    
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
