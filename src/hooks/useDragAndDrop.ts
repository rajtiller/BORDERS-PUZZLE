// CREATE FILE: src/hooks/useDragAndDrop.ts
import { useState, useCallback } from "react";
import type { Token } from "../types";

// Updated play area bounds to match GameBoard
const PLAY_AREA = {
  x: 80,
  y: 80,
  width: 1200, // Increased from 1000 to 1200
  height: 700, // Increased from 600 to 700
};

// Token radius for boundary calculations (smaller tokens)
const TOKEN_RADIUS = 25; // Reduced from 30 to 25

function constrainToPlayArea(x: number, y: number) {
  const minX = PLAY_AREA.x + TOKEN_RADIUS;
  const maxX = PLAY_AREA.x + PLAY_AREA.width - TOKEN_RADIUS;
  const minY = PLAY_AREA.y + TOKEN_RADIUS;
  const maxY = PLAY_AREA.y + PLAY_AREA.height - TOKEN_RADIUS;

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

export function useDragAndDrop(
  tokens: Token[],
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>
) {
  const [draggedToken, setDraggedToken] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, tokenId: string) => {
      const token = tokens.find((t) => t.id === tokenId);
      if (!token) return;

      setDraggedToken(tokenId);
      setOffset({
        x: e.clientX - token.x,
        y: e.clientY - token.y,
      });
    },
    [tokens]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedToken) return;

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      const constrainedPos = constrainToPlayArea(newX, newY);

      setTokens((prev) =>
        prev.map((token) =>
          token.id === draggedToken
            ? { ...token, x: constrainedPos.x, y: constrainedPos.y }
            : token
        )
      );
    },
    [draggedToken, offset, setTokens]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedToken(null);
  }, []);

  return {
    draggedToken,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
