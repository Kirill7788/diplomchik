import { HexColorPicker, HexColorInput } from "react-colorful";
import { CSSProperties } from "react";

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  preview: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "2px solid var(--border)",
  },
  hexInput: {
    width: "90px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    fontSize: "14px",
    fontFamily: "monospace",
    textAlign: "center" as const,
  },
};

export default function ColorPicker({ color, onChange }: Props) {
  return (
    <div style={styles.wrapper}>
      <HexColorPicker color={color} onChange={onChange} style={{ width: "100%" }} />
      <div style={styles.inputRow}>
        <div style={{ ...styles.preview, background: color }} />
        <HexColorInput
          color={color}
          onChange={onChange}
          prefixed
          style={styles.hexInput}
        />
      </div>
    </div>
  );
}
