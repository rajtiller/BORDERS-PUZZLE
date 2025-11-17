// CREATE FILE: src/components/GameBoard.tsx
import { useEffect } from "react";
import type { Token as TokenType, Region as RegionType } from "../types";
import { Token } from "./Token";
import { Region } from "./Region";

interface GameBoardProps {
  tokens: TokenType[];
  regions: RegionType[];
  draggedToken: string | null;
  onMouseMove: (e: MouseEvent) => void;
  onMouseUp: () => void;
  onMouseDown: (e: React.MouseEvent, tokenId: string) => void;
}

// Define larger play area bounds
export const PLAY_AREA = {
  x: 80,
  y: 80,
  width: 1200, // Increased from 1000 to 1200
  height: 700, // Increased from 600 to 700
  borderRadius: 20,
};

export function GameBoard({
  tokens,
  regions,
  draggedToken,
  onMouseMove,
  onMouseUp,
  onMouseDown,
}: GameBoardProps) {
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#e8f5e9", // Light green background
        overflow: "hidden",
      }}
    >
      {/* Play area rectangle */}
      <div
        style={{
          position: "absolute",
          left: PLAY_AREA.x,
          top: PLAY_AREA.y,
          width: PLAY_AREA.width,
          height: PLAY_AREA.height,
          background: "#fff",
          borderRadius: PLAY_AREA.borderRadius,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "2px solid rgba(0,0,0,0.1)",
        }}
      />

      {regions.map((region) => (
        <Region key={region.id} region={region} tokens={tokens} />
      ))}
      {tokens.map((token) => (
        <Token
          key={token.id}
          token={token}
          isDragging={draggedToken === token.id}
          onMouseDown={onMouseDown}
        />
      ))}
    </div>
  );
}
