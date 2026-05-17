import { CSSProperties } from "react";

interface Props {
  svgTemplate: string;
  color: string; // comma-separated for multi-zone: "#FF0000,#333,#FFF"
  size?: number;
  onClick?: () => void;
  selected?: boolean;
}

/** Parse zone names from data-zones attribute in SVG */
export function getZoneNames(svgTemplate: string): string[] {
  const match = svgTemplate.match(/data-zones="([^"]+)"/);
  if (!match) return ["Цвет"];
  return match[1].split(",");
}

/** Count how many FILL_COLOR zones an SVG has */
export function getZoneCount(svgTemplate: string): number {
  const zones = new Set<string>();
  const re = /FILL_COLOR_(\d+)/g;
  let m;
  while ((m = re.exec(svgTemplate)) !== null) {
    zones.add(m[1]);
  }
  if (zones.size === 0) {
    // legacy single-zone SVG
    return svgTemplate.includes("FILL_COLOR") ? 1 : 0;
  }
  return zones.size;
}

/** Apply colors to SVG template */
function applyColors(svgTemplate: string, colorStr: string): string {
  const colors = colorStr.split(",");
  let result = svgTemplate;

  // Replace numbered zones: FILL_COLOR_1, FILL_COLOR_2, etc.
  for (let i = 0; i < colors.length; i++) {
    const re = new RegExp(`FILL_COLOR_${i + 1}`, "g");
    result = result.replace(re, colors[i]);
  }

  // Fallback: replace any remaining FILL_COLOR (legacy single-zone)
  result = result.replace(/FILL_COLOR/g, colors[0]);

  return result;
}

export default function ClothingPreview({
  svgTemplate,
  color,
  size = 120,
  onClick,
  selected = false,
}: Props) {
  const coloredSvg = applyColors(svgTemplate, color);

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
