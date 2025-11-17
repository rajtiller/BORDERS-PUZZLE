// CREATE FILE: src/components/Region.tsx
import type { Region as RegionType, Token } from "../types";
import { calculateRegionSum, isRegionComplete } from "../utils/gameHelpers";

interface RegionProps {
  region: RegionType;
  tokens: Token[];
}

export function Region({ region, tokens }: RegionProps) {
  const currentSum = calculateRegionSum(tokens, region);
  const isComplete = isRegionComplete(tokens, region);
  const tooHigh = currentSum > region.target;

  return (
    <div
      style={{
        position: "absolute",
        left: region.x - region.radius,
        top: region.y - region.radius,
        width: region.radius * 2,
        height: region.radius * 2,
        borderRadius: "50%",
        border: `4px solid ${region.color}`,
        background: `${region.color}15`,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800 }}>
        <span
          style={{
            color: isComplete ? "#0f0" : tooHigh ? "#f00" : "#999",
          }}
        >
          {currentSum}
        </span>
        <span style={{ color: "#999", margin: "0 4px" }}>/</span>
        <span style={{ color: "#000" }}>{region.target}</span>
      </div>
    </div>
  );
}
