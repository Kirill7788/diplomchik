import { CSSProperties } from "react";

interface Props {
  svgTemplate: string;
  color: string;
  size?: number;
  onClick?: () => void;
  selected?: boolean;
  transparent?: boolean;
}

export function getZoneNames(svgTemplate: string): string[] {
  const match = svgTemplate.match(/data-zones="([^"]+)"/);
  if (!match) return ["Цвет"];
  return match[1].split(",");
}

export function getZoneCount(svgTemplate: string): number {
  const zones = new Set<string>();
  const re = /FILL_COLOR_(\d+)/g;
  let m;
  while ((m = re.exec(svgTemplate)) !== null) {
    zones.add(m[1]);
  }
  if (zones.size === 0) {
    return svgTemplate.includes("FILL_COLOR") ? 1 : 0;
  }
  return zones.size;
}

function applyColors(svgTemplate: string, colorStr: string): string {
  const colors = colorStr.split(",");
  let result = svgTemplate;

  for (let i = 0; i < colors.length; i++) {
    const re = new RegExp(`FILL_COLOR_${i + 1}`, "g");
    result = result.replace(re, colors[i]);
  }

  result = result.replace(/FILL_COLOR/g, colors[0]);

  return result;
}

export default function ClothingPreview({
  svgTemplate,
  color,
  size = 120,
  onClick,
  selected = false,
  transparent = false,
}: Props) {
  const coloredSvg = applyColors(svgTemplate, color);

  const style: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: onClick ? "pointer" : "default",
    border: selected ? "3px solid var(--primary)" : transparent ? "none" : "3px solid transparent",
    borderRadius: transparent ? "0" : "12px",
    padding: transparent ? "0" : "8px",
    background: transparent ? "transparent" : "#f9f9f9",
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
