// CREATE FILE: src/components/Sidebar.tsx
import type { Region, Token } from "../types";
import { calculateRegionSum, isRegionComplete } from "../utils/gameHelpers";

interface SidebarProps {
  regions: Region[];
  tokens: Token[];
  onReset: () => void;
  allComplete: boolean;
}

export function Sidebar({
  regions,
  tokens,
  onReset,
  allComplete,
}: SidebarProps) {
  return (
    <div
      style={{
        position: "fixed",
        right: 20, // Changed from left: 20 to right: 20
        top: 20,
        background: "rgba(249, 249, 249, 0.95)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
        padding: 20,
        minWidth: 200,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", color: "#000" }}>Regions</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {regions.map((region) => {
          const sum = calculateRegionSum(tokens, region);
          const complete = isRegionComplete(tokens, region);
          const tooHigh = sum > region.target;

          return (
            <div
              key={region.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 8,
                background: complete ? "#e8f5e9" : "#fff",
                borderRadius: 6,
                border: `2px solid ${region.color}`,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{region.id}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  <span
                    style={{
                      color: complete ? "#0f0" : tooHigh ? "#f00" : "#999",
                    }}
                  >
                    {sum}
                  </span>
                  <span style={{ color: "#999", margin: "0 4px" }}>/</span>
                  <span style={{ color: "#000" }}>{region.target}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allComplete && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#4caf50",
            color: "#fff",
            borderRadius: 6,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          🎉 Puzzle Complete!
        </div>
      )}

      <button
        onClick={onReset}
        style={{
          marginTop: 16,
          width: "100%",
          padding: 12,
          background: "#ff5722",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}
