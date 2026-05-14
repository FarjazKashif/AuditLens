export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#131315",
        panel: "#1c1b1d",
        panelHigh: "#2a2a2c",
        border: "#3c494c",
        text: "#e5e1e4",
        muted: "#bbc9cd",
        cyan: "#22d3ee",
        cyanSoft: "#8aebff",
        blue: "#adc6ff",
        amber: "#ffb13b",
        danger: "#ffb4ab"
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        DEFAULT: "0.25rem"
      }
    }
  },
  plugins: []
};
