/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgba(59, 130, 246);",  
        secondary: "rgba(31, 41, 55);",
        custom_color: "rgb(68, 67, 67)"
      }
    },
  },
  plugins: [],
};
