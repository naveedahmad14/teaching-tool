import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";

const DEFAULT_ARRAY = [2, 1, 5, 1, 3, 2];
const DEFAULT_K = 3;

function generateArray() {
  const len = 6 + Math.floor(Math.random() * 5);
  const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 10) + 1);
  return arr;
}

export default function SlidingWindowVisualizer() {
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [k, setK] = useState(DEFAULT_K);
  const [windowLeft, setWindowLeft] = useState(null);
  const [currentSum, setCurrentSum] = useState(null);
  const [maxSum, setMaxSum] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [adding, setAdding] = useState(null);
  const [done, setDone] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

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
  } = useVisualization({ initialSpeed: 700 });

  const runAlgorithm = useCallback(async () => {
    play();
    setDone(false);
    const arr = array;
    const n = arr.length;
    if (k > n) {
      stop();
      return;
    }

    let left = 0;
    let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let max = sum;

    setWindowLeft(0);
    setCurrentSum(sum);
    setMaxSum(max);
    setRemoving(null);
    setAdding(null);
    setStepIndex(0);
    await sleep(speed);
    if (cancelRef.current) return;

    try {
      for (left = 1; left <= n - k; left++) {
        if (cancelRef.current) break;

        const leave = left - 1;
        const enter = left + k - 1;
        setRemoving(leave);
        setAdding(enter);
        await sleep(speed);
        if (cancelRef.current) break;

        sum = sum - arr[leave] + arr[enter];
        if (sum > max) max = sum;
        setCurrentSum(sum);
        setMaxSum(max);
        setWindowLeft(left);
        setStepIndex(left);
        await sleep(speed);
        if (cancelRef.current) break;

        setRemoving(null);
        setAdding(null);
        await sleep(speed / 2);
        if (cancelRef.current) break;
      }

      if (!cancelRef.current) setDone(true);
    } finally {
      stop();
      setRemoving(null);
      setAdding(null);
    }
  }, [array, k, speed, sleep, play, stop, cancelRef]);

  const handlePlay = useCallback(() => {
    if (isPaused) {
      play();
    } else if (!isPlaying && !done) {
      runAlgorithm();
    }
  }, [isPaused, isPlaying, done, play, runAlgorithm]);

  const handleNext = useCallback(() => {
    const n = array.length;
    const maxSteps = n - k + 1;
    if (done || stepIndex >= maxSteps - 1) return;

    if (windowLeft === null) {
      const sum = array.slice(0, k).reduce((a, b) => a + b, 0);
      setWindowLeft(0);
      setCurrentSum(sum);
      setMaxSum(sum);
      setStepIndex(0);
      return;
    }

    const left = stepIndex + 1;
    if (left > n - k) return;

    const leave = left - 1;
    const enter = left + k - 1;
    const newSum = currentSum - array[leave] + array[enter];
    const newMax = Math.max(maxSum, newSum);

    setRemoving(leave);
    setAdding(enter);
    setCurrentSum(newSum);
    setMaxSum(newMax);
    setWindowLeft(left);
    setStepIndex(left);
    setRemoving(null);
    setAdding(null);
    if (left === n - k) setDone(true);
  }, [array, k, windowLeft, stepIndex, currentSum, maxSum, done]);

  const handleReset = useCallback(() => {
    resetControl();
    setArray([...DEFAULT_ARRAY]);
    setK(DEFAULT_K);
    setWindowLeft(null);
    setCurrentSum(null);
    setMaxSum(null);
    setRemoving(null);
    setAdding(null);
    setDone(false);
    setStepIndex(0);
  }, [resetControl]);

  const handleNewArray = useCallback(() => {
    resetControl();
    const newArr = generateArray();
    setArray(newArr);
    setK(Math.min(DEFAULT_K, Math.max(1, newArr.length - 2)));
    setWindowLeft(null);
    setCurrentSum(null);
    setMaxSum(null);
    setRemoving(null);
    setAdding(null);
    setDone(false);
    setStepIndex(0);
  }, [resetControl]);

  const getCellStyle = useCallback(
    (index) => {
      const inWindow = windowLeft !== null && index >= windowLeft && index < windowLeft + k;
      if (removing === index) return "bg-red-500 text-white ring-2 ring-red-700";
      if (adding === index) return "bg-green-500 text-white ring-2 ring-green-700";
      if (inWindow) return "bg-[#625EC6] text-white";
      return "bg-gray-600 text-gray-200";
    },
    [windowLeft, k, removing, adding]
  );

  const n = array.length;
  const maxSteps = Math.max(0, n - k + 1);

  useEffect(() => {
    setWindowLeft(null);
    setCurrentSum(null);
    setMaxSum(null);
    setRemoving(null);
    setAdding(null);
    setDone(false);
    setStepIndex(0);
  }, [k]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">
        Sliding Window: Max Sum of Size k
      </h2>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="text-gray-200 text-sm font-medium">Window size k:</label>
        <input
          type="number"
          min={1}
          max={n}
          value={k}
          onChange={(e) => setK(Math.min(n, Math.max(1, parseInt(e.target.value, 10) || 1)))}
          disabled={isPlaying || windowLeft !== null}
          className="w-16 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
        />
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-inner">
        <div className="flex flex-wrap justify-center gap-2 min-h-[100px] items-end">
          <AnimatePresence mode="sync">
            {array.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                layout
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg font-bold text-lg shadow-md ${getCellStyle(index)}`}
                  transition={{ duration: 0.25 }}
                >
                  {value}
                </motion.div>
                <span className="text-xs text-gray-500 mt-1">i={index}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex flex-wrap gap-6 justify-center text-sm">
          <div className="bg-[#16213E] rounded-lg px-4 py-2 border border-[#625EC6]/50">
            <span className="text-gray-400">Current sum: </span>
            <span className="font-bold text-white">{currentSum ?? "—"}</span>
          </div>
          <div className="bg-[#16213E] rounded-lg px-4 py-2 border border-[#FFD700]/50">
            <span className="text-gray-400">Max sum: </span>
            <span className="font-bold text-[#FFD700]">{maxSum ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center text-xs sm:text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#625EC6]" aria-hidden />
          <span className="text-gray-100">In window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" aria-hidden />
          <span className="text-gray-100">Removed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" aria-hidden />
          <span className="text-gray-100">Added</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#FFD700]">Gold</span>
          <span className="text-gray-100">= max sum</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
        <button
          type="button"
          onClick={handlePlay}
          disabled={done && !isPaused}
          className="px-6 py-2 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#7B75D4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {isPaused ? "Resume" : isPlaying ? "Running…" : done ? "Done" : "Play"}
        </button>

        {isPlaying && !isPaused && (
          <button
            type="button"
            onClick={pause}
            className="px-6 py-2 bg-[#FFD700] text-gray-900 rounded-lg font-semibold hover:bg-[#FFE44D] transition-colors shadow-md"
          >
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={done || (windowLeft !== null && stepIndex >= maxSteps - 1)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          Next
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleNewArray}
          disabled={isPlaying}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
        >
          New array
        </button>

        <div className="flex items-center gap-3">
          <label htmlFor="sliding-speed" className="text-gray-100 font-medium">
            Speed:
          </label>
          <input
            id="sliding-speed"
            type="range"
            min="300"
            max="1200"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isPlaying}
            className="w-32"
          />
          <span className="text-gray-100 text-sm w-12">{speed}ms</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
        <h3 className="font-semibold text-[#FFD700] mb-2">Optimized update</h3>
        <p className="text-gray-200 text-sm">
          Instead of summing k elements each time, subtract the element leaving the window and add the element entering: <code className="text-purple-300">newSum = currentSum - arr[left] + arr[right]</code>. One pass, O(n).
        </p>
      </div>
    </div>
  );
}
