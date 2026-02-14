import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";
import VerticalStack from "./VerticalStack";

const DEFAULT_ARRAY = [2, 1, 5, 1, 3, 2];

export default function StackVisualizer() {
  const [array, setArray] = useState([...DEFAULT_ARRAY]);
  const [stackIndices, setStackIndices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [result, setResult] = useState([]);
  const [poppedStackPosition, setPoppedStackPosition] = useState(null);
  const [operationLabel, setOperationLabel] = useState("");
  const [done, setDone] = useState(false);

  const {
    speed,
    setSpeed,
    isPlaying,
    isPaused,
    sleep,
    play,
    pause,
    reset: resetControl,
    stop,
    cancelRef,
  } = useVisualization({ initialSpeed: 800 });

  const runAlgorithm = useCallback(async () => {
    play();
    setDone(false);
    const arr = array;
    const n = arr.length;
    const res = Array(n).fill(-1);
    const stack = [];

    setResult([...res]);
    setStackIndices([]);
    setOperationLabel("Start");
    await sleep(speed);
    if (cancelRef.current) return;

    try {
      for (let i = 0; i < n; i++) {
        if (cancelRef.current) break;

        setCurrentIndex(i);
        setOperationLabel(`Check arr[${i}]=${arr[i]} vs stack top`);
        await sleep(speed);
        if (cancelRef.current) break;

        while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
          const topPos = stack.length - 1;
          setPoppedStackPosition(topPos);
          setOperationLabel(`Pop index ${stack[stack.length - 1]} (${arr[stack[stack.length - 1]]} < ${arr[i]}) → NGE = ${arr[i]}`);
          await sleep(speed);
          if (cancelRef.current) break;

          const idx = stack.pop();
          res[idx] = arr[i];
          setResult([...res]);
          setStackIndices(stack.map((k) => ({ value: arr[k], index: k })));
          await sleep(speed);
          if (cancelRef.current) break;
          setPoppedStackPosition(null);
        }

        setOperationLabel(`Push index ${i}`);
        stack.push(i);
        setStackIndices(stack.map((k) => ({ value: arr[k], index: k })));
        await sleep(speed);
        if (cancelRef.current) break;
      }

      setCurrentIndex(null);
      setOperationLabel("Done. Remaining in stack → NGE = -1");
      if (!cancelRef.current) setDone(true);
    } finally {
      stop();
      setPoppedStackPosition(null);
      setOperationLabel("");
    }
  }, [array, speed, sleep, play, stop, cancelRef]);

  const handlePlay = useCallback(() => {
    if (isPaused) play();
    else if (!isPlaying && !done) runAlgorithm();
  }, [isPaused, isPlaying, done, play, runAlgorithm]);

  const handleReset = useCallback(() => {
    resetControl();
    setArray([...DEFAULT_ARRAY]);
    setStackIndices([]);
    setCurrentIndex(null);
    setResult(Array(DEFAULT_ARRAY.length).fill(-1));
    setPoppedStackPosition(null);
    setOperationLabel("");
    setDone(false);
  }, [resetControl]);

  const stackItems = stackIndices.map((item, pos) => ({
    ...item,
    _pos: pos,
  }));

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Next Greater Element (Monotonic Stack)</h2>

      <div className="mb-4 p-3 rounded bg-[#16213E] border border-[#625EC6]/50 text-gray-200 text-sm">
        <strong className="text-[#FFD700]">Current:</strong> {operationLabel || "—"}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-end">
        <div>
          <p className="text-gray-400 text-sm mb-2">Input array</p>
          <div className="flex flex-wrap gap-2">
            {array.map((val, i) => (
              <motion.div
                key={i}
                className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-sm shadow ${
                  currentIndex === i ? "bg-yellow-500 text-gray-900 ring-2 ring-[#FFD700]" : "bg-gray-600 text-gray-200"
                }`}
                transition={{ duration: 0.2 }}
              >
                {val}
                <span className="text-xs opacity-80">i={i}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-sm mb-2">Stack (indices → values)</p>
          <VerticalStack
            items={stackItems}
            highlightTop={stackItems.length > 0 && poppedStackPosition === null}
            highlightPopped={poppedStackPosition}
            emptyLabel="empty"
          />
          <p className="text-gray-500 text-xs mt-2">↑ top</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">Result (NGE)</p>
          <div className="flex flex-wrap gap-2">
            {result.map((val, i) => (
              <motion.div
                key={i}
                className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-sm shadow ${
                  val !== -1 ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"
                }`}
                transition={{ duration: 0.2 }}
              >
                {val}
                <span className="text-xs opacity-80">i={i}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center text-xs sm:text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" aria-hidden />
          <span className="text-gray-100">Stack</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" aria-hidden />
          <span className="text-gray-100">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" aria-hidden />
          <span className="text-gray-100">Popped</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" aria-hidden />
          <span className="text-gray-100">Result (NGE)</span>
        </div>
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
        <button type="button" onClick={handleReset} className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md">
          Reset
        </button>
        <div className="flex items-center gap-3">
          <label className="text-gray-100 font-medium">Speed:</label>
          <input
            type="range"
            min="400"
            max="1200"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isPlaying}
            className="w-32"
          />
          <span className="text-gray-100 text-sm">{speed}ms</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
        <h3 className="font-semibold text-[#FFD700] mb-2">Why pop when smaller?</h3>
        <p className="text-gray-200 text-sm">
          We keep a <strong>monotonic decreasing</strong> stack (values from bottom to top decrease). When we see a larger element, it is the &quot;next greater&quot; for all smaller elements on the stack, so we pop them and assign the result, then push the current index.
        </p>
      </div>
    </div>
  );
}
