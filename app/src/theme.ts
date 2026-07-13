// DigitalTwin design tokens — brand: #5CA3FF on white.

export const colors = {
  sky: "#5CA3FF", // brand
  skySoft: "#8FC0FF",
  deep: "#1F4E8C", // readable brand-dark for text on light
  ink: "#16233A",
  soft: "#5C6B82",
  mist: "#F3F8FF", // tinted background
  cloud: "#FFFFFF",
  line: "#DCE9FB",
  sage: "#2E9E63", // done
  sageTint: "#E3F5EB",
  ember: "#E4573D", // missed / alert
  emberTint: "#FCEAE6",
  gold: "#F5B840", // warm accent (sun)
};

export const fonts = {
  display: "Fraunces_600SemiBold", // warm serif — greetings, big moments
  body: "Manrope_400Regular",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_800ExtraBold",
};

export const type = {
  heading: 32,
  title: 24,
  body: 18,
  button: 20,
  caption: 15,
};

export const space = { xs: 8, sm: 16, md: 24, lg: 32, xl: 48 };

export const radius = 24;

export const buttonHeight = 64;

export const shadow = {
  card: {
    shadowColor: "#1F4E8C",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  button: {
    shadowColor: "#1F4E8C",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
};
