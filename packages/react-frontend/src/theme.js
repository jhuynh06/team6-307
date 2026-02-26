import { createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "green",
  primaryShade: 8,
  fontFamily: "Lato, Arial, Helvetica, sans-serif",
  headings: {
    fontFamily: "Lato, Arial, Helvetica, sans-serif",
    fontWeight: "700"
  },
  defaultRadius: "md",
  colors: {
    green: [
      "#e8f5e9",
      "#c8e6c9",
      "#a5d6a7",
      "#81c784",
      "#66bb6a",
      "#8BC34A",
      "#43a047",
      "#388e3c",
      "#2e7d32",
      "#1b5e20"
    ]
  },
  components: {
    Button: {
      defaultProps: {
        radius: "md"
      }
    },
    Card: {
      defaultProps: {
        shadow: "sm",
        radius: "md",
        withBorder: true
      }
    },
    Paper: {
      defaultProps: {
        radius: "md",
        withBorder: true
      }
    },
    Checkbox: {
      defaultProps: {
        color: "green",
        size: "md"
      }
    },
    Rating: {
      defaultProps: {
        color: "yellow"
      }
    }
  }
});

export default theme;
