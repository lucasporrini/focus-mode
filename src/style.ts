import { COLORS } from "./constantes";

export const STYLES = {
  container: {
    minWidth: "700px",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    whiteSpace: "nowrap",
    borderRadius: 6,
    border: "none",
    padding: 4,
    fontSize: 12,
    backgroundColor: COLORS.black,
    color: COLORS.white,
    cursor: "pointer",
    marginRight: "5px",
    transition: "all 0.3s ease",
  },
};
