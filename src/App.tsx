import { useState } from "react";
import "./App.css";
import type { Token, Region } from "./types";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { areAllRegionsComplete } from "./utils/gameHelpers";
import { GameBoard } from "./components/GameBoard";
import { Sidebar } from "./components/Sidebar";

// Position tokens within the play area bounds (100px margin from edges)
const INITIAL_TOKENS: Token[] = [
  { id: "t1", value: 1, x: 150, y: 150 },
  { id: "t2", value: 2, x: 150, y: 210 },
  { id: "t3", value: 3, x: 150, y: 270 },
  { id: "t4", value: 4, x: 150, y: 330 },
  { id: "t5", value: 5, x: 150, y: 390 },
  { id: "t6", value: 6, x: 200, y: 150 },
  { id: "t7", value: 7, x: 200, y: 210 },
  { id: "t8", value: 8, x: 200, y: 270 },
  { id: "t9", value: 9, x: 200, y: 330 },
];

// Much larger overlapping regions with bigger overlaps for better visibility
const REGIONS: Region[] = [
  { id: "A", x: 500, y: 300, radius: 180, target: 20, color: "#ff3b30" },
  { id: "B", x: 650, y: 250, radius: 170, target: 15, color: "#5ac8fa" },
  { id: "C", x: 800, y: 350, radius: 175, target: 25, color: "#34c759" },
  { id: "D", x: 580, y: 450, radius: 160, target: 18, color: "#ff9500" },
  { id: "E", x: 720, y: 500, radius: 155, target: 12, color: "#af52de" },
  { id: "F", x: 900, y: 200, radius: 165, target: 22, color: "#ff2d92" },
];

function App() {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const { draggedToken, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDragAndDrop(tokens, setTokens);

  const allComplete = areAllRegionsComplete(tokens, REGIONS);

  const handleReset = () => {
    setTokens(INITIAL_TOKENS);
  };

  return (
    <>
      <GameBoard
        tokens={tokens}
        regions={REGIONS}
        draggedToken={draggedToken}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      />
      <Sidebar
        regions={REGIONS}
        tokens={tokens}
        onReset={handleReset}
        allComplete={allComplete}
      />
    </>
  );
}

export default App;
