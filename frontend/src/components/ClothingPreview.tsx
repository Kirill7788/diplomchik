import { CSSProperties } from "react";

interface Props {
  svgTemplate: string;
  color: string;
  size?: number;
  onClick?: () => void;
  selected?: boolean;
}

export default function ClothingPreview({
  svgTemplate,
  color,
  size = 120,
  onClick,
  selected = false,
}: Props) {
  const coloredSvg = svgTemplate.replace(/FILL_COLOR/g, color);

  const style: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: onClick ? "pointer" : "default",
    border: selected ? "3px solid var(--primary)" : "3px solid transparent",
    borderRadius: "12px",
    padding: "8px",
    background: "#f9f9f9",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={style}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: coloredSvg }}
    />
  );
}
