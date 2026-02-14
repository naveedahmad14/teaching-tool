import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";

const NODE_WIDTH = 48;
const NODE_GAP = 12;
const SLOT = NODE_WIDTH + NODE_GAP;

const DEFAULT_VALUES = [1, 2, 3, 4, 5];

function buildNextPointers(n) {
  const next = [];
  for (let i = 0; i < n; i++) next.push(i + 1 < n ? i + 1 : null);
  return next;
}

export default function LinkedListVisualizer() {
  const [mode, setMode] = useState("reverse"); // "reverse" | "middle"
  const [values, setValues] = useState([...DEFAULT_VALUES]);
  const [nextPointers, setNextPointers] = useState(buildNextPointers(DEFAULT_VALUES.length));
  const [prev, setPrev] = useState(null);
  const [curr, setCurr] = useState(null);
  const [next, setNext] = useState(null);
  const [slow, setSlow] = useState(null);
  const [fast, setFast] = useState(null);
  const [done, setDone] = useState(false);

  const { speed, setSpeed, isPlaying, isPaused, sleep, play, pause, reset: resetControl, stop, cancelRef } = useVisualization({ initialSpeed: 900 });

  const reset = useCallback(() => {
    resetControl();
    setValues([...DEFAULT_VALUES]);
    setNextPointers(buildNextPointers(DEFAULT_VALUES.length));
    setPrev(null);
    setCurr(null);
    setNext(null);
    setSlow(null);
    setFast(null);
    setDone(false);
  }, [resetControl]);

  const runReverse = useCallback(async () => {
    play();
    setDone(false);
    const n = values.length;
    if (n === 0) {
      stop();
      setDone(true);
      return;
    }

    let prevIdx = null;
    let currIdx = 0;
    const nextPtrs = [...nextPointers];

    setNextPointers([...nextPtrs]);
    setPrev(null);
    setCurr(0);
    setNext(nextPtrs[0]);
    await sleep(speed);
    if (cancelRef.current) return;

    try {
      while (currIdx !== null) {
        if (cancelRef.current) break;
        const nextIdx = nextPtrs[currIdx];
        setNext(nextIdx);
        await sleep(speed);
        if (cancelRef.current) break;

        nextPtrs[currIdx] = prevIdx;
        setNextPointers([...nextPtrs]);
        await sleep(speed);
        if (cancelRef.current) break;

        prevIdx = currIdx;
        currIdx = nextIdx;
        setPrev(prevIdx);
        setCurr(currIdx);
        await sleep(speed);
        if (cancelRef.current) break;
      }
      if (!cancelRef.current) setDone(true);
    } finally {
      stop();
      setPrev(null);
      setCurr(null);
      setNext(null);
    }
  }, [values.length, nextPointers, speed, sleep, play, stop, cancelRef]);

  const runMiddle = useCallback(async () => {
    play();
    setDone(false);
    const n = values.length;
    if (n === 0) {
      stop();
      setDone(true);
      return;
    }

    let slowIdx = 0;
    let fastIdx = 0;
    setSlow(0);
    setFast(0);
    await sleep(speed);
    if (cancelRef.current) return;

    try {
      while (fastIdx !== null && nextPointers[fastIdx] !== null) {
        if (cancelRef.current) break;
        fastIdx = nextPointers[fastIdx];
        if (fastIdx === null) break;
        fastIdx = nextPointers[fastIdx];
        slowIdx = nextPointers[slowIdx];
        setFast(fastIdx);
        setSlow(slowIdx);
        await sleep(speed);
        if (cancelRef.current) break;
      }
      if (!cancelRef.current) setDone(true);
    } finally {
      stop();
    }
  }, [values.length, nextPointers, speed, sleep, play, stop, cancelRef]);

  const runAlgorithm = useCallback(() => {
    if (mode === "reverse") return runReverse();
    return runMiddle();
  }, [mode, runReverse, runMiddle]);

  const handlePlay = useCallback(() => {
    if (isPaused) play();
    else if (!isPlaying && !done) runAlgorithm();
  }, [isPaused, isPlaying, done, play, runAlgorithm]);

  const n = values.length;
  const totalWidth = n * SLOT + NODE_GAP + 52;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Linked List</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <span className="text-gray-400 text-sm font-medium">Mode:</span>
        <button
          type="button"
          onClick={() => { setMode("reverse"); reset(); }}
          className={`px-3 py-1 rounded text-sm font-medium ${mode === "reverse" ? "bg-[#625EC6] text-white" : "bg-gray-700 text-gray-300"}`}
        >
          Reverse
        </button>
        <button
          type="button"
          onClick={() => { setMode("middle"); reset(); }}
          className={`px-3 py-1 rounded text-sm font-medium ${mode === "middle" ? "bg-[#625EC6] text-white" : "bg-gray-700 text-gray-300"}`}
        >
          Middle (Fast & Slow)
        </button>
      </div>

      <div className="overflow-x-auto py-4" style={{ minHeight: "140px" }}>
        <div className="relative inline-flex items-center" style={{ minWidth: totalWidth }}>
          <svg width={totalWidth} height={80} className="absolute inset-0 pointer-events-none" style={{ left: 0, top: "50%", transform: "translateY(-50%)" }}>
            {nextPointers.map((to, i) => {
              const x1 = i * SLOT + NODE_WIDTH;
              const y1 = 40;
              const x2 = to !== null ? to * SLOT : n * SLOT;
              const y2 = 40;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={2} className="text-gray-500" />
                  {to !== null ? (
                    <polygon points={`${x2 - 6},${y2 - 4} ${x2 - 6},${y2 + 4} ${x2},${y2}`} fill="currentColor" className="text-gray-500" />
                  ) : (
                    <circle cx={x2} cy={y2} r={4} fill="currentColor" className="text-gray-500" />
                  )}
                </g>
              );
            })}
          </svg>
          {values.map((val, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center shrink-0"
              style={{ width: SLOT }}
              layout
            >
              <motion.div
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-md border-2 ${
                  mode === "reverse"
                    ? prev === i
                      ? "bg-red-500 text-white border-red-700"
                      : curr === i
                        ? "bg-blue-500 text-white border-[#FFD700]"
                        : next === i
                          ? "bg-green-500 text-white border-green-700"
                          : "bg-gray-600 text-gray-200 border-gray-500"
                    : slow === i
                      ? "bg-[#FFD700] text-gray-900 border-amber-600"
                      : fast === i
                        ? "bg-cyan-500 text-white border-cyan-700"
                        : "bg-gray-600 text-gray-200 border-gray-500"
                }`}
                transition={{ duration: 0.2 }}
              >
                {val}
              </motion.div>
              <div className="mt-1 flex flex-wrap justify-center gap-0.5 text-xs font-bold">
                {mode === "reverse" && prev === i && <span className="text-red-400">prev</span>}
                {mode === "reverse" && curr === i && <span className="text-blue-400">curr</span>}
                {mode === "reverse" && next === i && <span className="text-green-400">next</span>}
                {mode === "middle" && slow === i && <span className="text-[#FFD700]">slow</span>}
                {mode === "middle" && fast === i && <span className="text-cyan-400">fast</span>}
              </div>
            </motion.div>
          ))}
          <div className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono text-xs bg-gray-800 text-gray-500 border-2 border-dashed border-gray-600" style={{ width: SLOT }}>
            null
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center text-xs sm:text-sm mb-6">
        {mode === "reverse" && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" aria-hidden />
              <span className="text-gray-100">prev</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500 border border-[#FFD700]" aria-hidden />
              <span className="text-gray-100">curr</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" aria-hidden />
              <span className="text-gray-100">next</span>
            </div>
          </>
        )}
        {mode === "middle" && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#FFD700]" aria-hidden />
              <span className="text-gray-100">slow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-cyan-500" aria-hidden />
              <span className="text-gray-100">fast</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        <button
          type="button"
          onClick={handlePlay}
          disabled={done && !isPaused}
          className="px-6 py-2 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#7B75D4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {isPaused ? "Resume" : isPlaying ? "Running…" : done ? "Done" : "Play"}
        </button>
        {isPlaying && !isPaused && (
          <button type="button" onClick={pause} className="px-6 py-2 bg-[#FFD700] text-gray-900 rounded-lg font-semibold hover:bg-[#FFE44D] transition-colors shadow-md">
            Pause
          </button>
        )}
        <button type="button" onClick={reset} className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md">
          Reset
        </button>
        <div className="flex items-center gap-3">
          <label className="text-gray-100 font-medium">Speed:</label>
          <input type="range" min="400" max="1400" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} disabled={isPlaying} className="w-32" />
          <span className="text-gray-100 text-sm">{speed}ms</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
        <h3 className="font-semibold text-[#FFD700] mb-2">
          {mode === "reverse" ? "Reverse" : "Middle"}
        </h3>
        <p className="text-gray-200 text-sm">
          {mode === "reverse"
            ? "prev=reversed so far, curr=current node, next=curr.next (saved). Each step: curr.next = prev, then advance."
            : "Slow moves 1 step, fast moves 2. When fast reaches the end, slow is at the middle."}
        </p>
      </div>
    </div>
  );
}
