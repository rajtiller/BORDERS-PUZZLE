import { useState, type DragEvent } from "react";
import "./App.css";

type Token = { id: string; value: number; pos: number | null };
type Area = { id: string; cells: number[]; target: number };

const ROWS = 5;
const COLS = 5;
const CELL_COUNT = ROWS * COLS;

// visual layout constants (keep in sync with CSS)
const CELL_SIZE = 64;
const GAP = 6;
const PADDING = 8;

function sampleAreas(): Area[] {
  return [
    { id: "A", cells: [0, 1, 5, 6], target: 7 },
    { id: "B", cells: [1, 2, 6, 7], target: 8 },
    { id: "C", cells: [10, 11, 15, 16], target: 6 },
    { id: "D", cells: [6, 7, 11, 12], target: 9 },
  ];
}

function initialTokens(): Token[] {
  return [
    { id: "t1", value: 1, pos: null },
    { id: "t2", value: 2, pos: null },
    { id: "t3", value: 3, pos: null },
    { id: "t4", value: 1, pos: null },
    { id: "t5", value: 4, pos: null },
    { id: "t6", value: 2, pos: null },
  ];
}

function App() {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [areas] = useState<Area[]>(sampleAreas);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  function tokenAt(pos: number) {
    return tokens.find((t) => t.pos === pos) ?? null;
  }

  function placeToken(tokenId: string, pos: number | null) {
    setTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, pos } : t))
    );
    setSelectedTokenId(null);
  }

  function onCellClick(idx: number) {
    const selected = selectedTokenId
      ? tokens.find((t) => t.id === selectedTokenId)!
      : null;
    const occupant = tokenAt(idx);

    if (selected) {
      if (occupant && occupant.id !== selected.id) {
        setTokens((prev) =>
          prev.map((t) => {
            if (t.id === selected.id) return { ...t, pos: idx };
            if (t.id === occupant.id)
              return { ...t, pos: selected.pos ?? null };
            return t;
          })
        );
      } else {
        placeToken(selected.id, idx);
      }
      return;
    }

    if (occupant) setSelectedTokenId(occupant.id);
  }

  // ---------- Drag & Drop handlers ----------
  function onDragStart(e: DragEvent, tokenId: string) {
    e.dataTransfer.setData("text/plain", tokenId);
    e.dataTransfer.effectAllowed = "move";
    setSelectedTokenId(tokenId);
  }

  function onDragOverCell(e: DragEvent) {
    e.preventDefault(); // allow drop
    e.dataTransfer.dropEffect = "move";
  }

  function onDropOnCell(e: DragEvent, idx: number) {
    e.preventDefault();
    const tokenId = e.dataTransfer.getData("text/plain");
    if (!tokenId) return;
    const dragged = tokens.find((t) => t.id === tokenId);
    if (!dragged) return;

    const occupant = tokenAt(idx);
    if (occupant && occupant.id !== dragged.id) {
      setTokens((prev) =>
        prev.map((t) => {
          if (t.id === dragged.id) return { ...t, pos: idx };
          if (t.id === occupant.id) return { ...t, pos: dragged.pos ?? null };
          return t;
        })
      );
    } else {
      placeToken(dragged.id, idx);
    }
  }

  function onPaletteClick(t: Token) {
    if (selectedTokenId === t.id) {
      setSelectedTokenId(null);
    } else {
      setSelectedTokenId(t.id);
    }
  }

  function areaSum(area: Area) {
    return tokens
      .filter((t) => t.pos !== null && area.cells.includes(t.pos!))
      .reduce((s, t) => s + t.value, 0);
  }

  const allAreasComplete = areas.every((a) => areaSum(a) === a.target);

  // compute pixel layout for cells so we can position SVG circles
  const gridWidth = COLS * CELL_SIZE + (COLS - 1) * GAP + 2 * PADDING;
  const gridHeight = ROWS * CELL_SIZE + (ROWS - 1) * GAP + 2 * PADDING;

  function cellCenter(idx: number) {
    const r = Math.floor(idx / COLS);
    const c = idx % COLS;
    const x = PADDING + c * (CELL_SIZE + GAP) + CELL_SIZE / 2;
    const y = PADDING + r * (CELL_SIZE + GAP) + CELL_SIZE / 2;
    return { x, y };
  }

  // area colors (high-contrast set)
  const areaPalette = [
    "#ff3b30",
    "#ff9500",
    "#5ac8fa",
    "#34c759",
    "#8e8e93",
    "#ff2d55",
  ];

  return (
    <div
      className="puzzle-root"
      style={{ display: "flex", gap: 20, padding: 20 }}
    >
      <div className="left" style={{ minWidth: 220 }}>
        <h2 style={{ color: "#fff" }}>Tokens</h2>
        <div
          className="palette"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          {tokens.map((t) => (
            <button
              key={t.id}
              draggable
              onDragStart={(e) => onDragStart(e, t.id)}
              onClick={() => onPaletteClick(t)}
              className={`token-btn ${
                selectedTokenId === t.id ? "selected" : ""
              }`}
              title={t.pos === null ? "unplaced" : `placed at ${t.pos}`}
            >
              {t.value}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            onClick={() =>
              setTokens((prev) => prev.map((t) => ({ ...t, pos: null })))
            }
          >
            Reset placements
          </button>
        </div>

        <h3 style={{ marginTop: 20, color: "#fff" }}>Areas</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {areas.map((a, i) => {
            const sum = areaSum(a);
            const complete = sum === a.target;
            return (
              <div
                key={a.id}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  background: complete ? "#051" : "#111",
                  border: "1px solid #333",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "#fff" }}>{a.id}</strong>
                  <div style={{ fontSize: 12, color: "#9aa" }}>
                    target:{" "}
                    <span style={{ color: complete ? "#0f0" : "#000" }}>
                      {a.target}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, color: "#999" }}>{sum}</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: areaPalette[i % areaPalette.length],
                    }}
                  >
                    color
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16, color: "#fff" }}>
          {allAreasComplete ? (
            <strong>All areas complete! 🎉</strong>
          ) : (
            <em>Complete all areas to solve.</em>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ color: "#fff" }}>Board</h2>

        <div
          className="grid"
          style={{
            position: "relative",
            width: gridWidth,
            height: gridHeight,
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
            gap: GAP,
            background: "#000",
            padding: PADDING,
            borderRadius: 8,
            border: "2px solid #222",
            boxSizing: "content-box",
          }}
        >
          {/* SVG overlay for circular regions (pointerEvents none so clicks pass through) */}
          <svg
            width={gridWidth}
            height={gridHeight}
            viewBox={`0 0 ${gridWidth} ${gridHeight}`}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "none",
            }}
            aria-hidden
          >
            {areas.map((a, i) => {
              const centers = a.cells.map(cellCenter);
              const cx = centers.reduce((s, c) => s + c.x, 0) / centers.length;
              const cy = centers.reduce((s, c) => s + c.y, 0) / centers.length;
              const r =
                Math.max(
                  ...centers.map((c) => Math.hypot(c.x - cx, c.y - cy))
                ) + 30;
              const color = areaPalette[i % areaPalette.length];
              const sum = areaSum(a);
              const complete = sum === a.target;
              return (
                <g key={a.id}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={color}
                    fillOpacity={0.1}
                    stroke={color}
                    strokeWidth={4}
                    strokeOpacity={0.9}
                  />
                  {/* target (black or green when complete) */}
                  <text
                    x={cx}
                    y={cy - 6}
                    textAnchor="middle"
                    fontSize={16}
                    fontWeight={700}
                    fill={complete ? "#0f0" : "#000"}
                    style={{ paintOrder: "stroke" }}
                  >
                    {a.target}
                  </text>
                  {/* current sum (gray) */}
                  <text
                    x={cx}
                    y={cy + 18}
                    textAnchor="middle"
                    fontSize={12}
                    fill="#999"
                  >
                    {sum}
                  </text>
                </g>
              );
            })}
          </svg>

          {Array.from({ length: CELL_COUNT }).map((_, idx) => {
            const t = tokenAt(idx);
            const coveringAreas = areas
              .filter((a) => a.cells.includes(idx))
              .map((a) => a.id);
            return (
              <div
                key={idx}
                onClick={() => onCellClick(idx)}
                onDragOver={onDragOverCell}
                onDrop={(e) => onDropOnCell(e, idx)}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
                }}
                title={`Cell ${idx} — areas: ${coveringAreas.join(",")}`}
              >
                {t ? (
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, t.id)}
                    className={`board-token ${
                      selectedTokenId === t.id ? "selected" : ""
                    }`}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: selectedTokenId === t.id ? "#ffd60a" : "#0af",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
                      userSelect: "none",
                    }}
                  >
                    {t.value}
                  </div>
                ) : (
                  <div style={{ color: "#222" }}>&nbsp;</div>
                )}

                {coveringAreas.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      fontSize: 10,
                      color: "#fff",
                      background: "rgba(0,0,0,0.4)",
                      padding: "2px 6px",
                      borderRadius: 999,
                    }}
                  >
                    {coveringAreas.join(",")}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: 8, color: "#bbb" }}>
          Drag tokens from the palette onto the board. Drop onto another token
          to swap.
        </p>
      </div>
    </div>
  );
}

export default App;
