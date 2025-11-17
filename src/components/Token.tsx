// CREATE FILE: src/components/Token.tsx
import type { Token as TokenType } from "../types";

interface TokenProps {
  token: TokenType;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent, tokenId: string) => void;
}

export function Token({ token, isDragging, onMouseDown }: TokenProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: token.x - 25, // Reduced from 30 to 25
        top: token.y - 25, // Reduced from 30 to 25
        width: 50, // Reduced from 60 to 50
        height: 50, // Reduced from 60 to 50
        borderRadius: "50%",
        background: isDragging ? "#ffd60a" : "#00d1ff",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20, // Reduced from 24 to 20
        fontWeight: 800,
        cursor: "grab",
        userSelect: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: isDragging ? 1000 : 10,
      }}
      onMouseDown={(e) => onMouseDown(e, token.id)}
    >
      {token.value}
    </div>
  );
}
