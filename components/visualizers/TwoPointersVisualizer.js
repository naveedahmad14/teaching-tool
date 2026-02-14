import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";

const DEFAULT_ARRAY = [1, 1, 2, 2, 2, 3, 4, 4, 4, 5];

function generateSortedWithDuplicates() {
  const len = 8 + Math.floor(Math.random() * 5);
  const arr = [];
  let v = 1;
  for (let i = 0; i < len; i++) {
    arr.push(v);
    if (Math.random() > 0.4) v++;
  }
  return arr;
}

export default function TwoPointersVisualizer() {
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [read, setRead] = useState(null);
  const [write, setWrite] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [overwrite, setOverwrite] = useState(null);
  const [uniqueCount, setUniqueCount] = useState(null);
  const [comparisonCount, setComparisonCount] = useState(0);
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
  } = useVisualization({ initialSpeed: 600 });

  const generateArray = useCallback(() => {
    setArray(generateSortedWithDuplicates());
    setRead(null);
    setWrite(null);
    setComparing(false);
    setOverwrite(null);
    setUniqueCount(null);
    setComparisonCount(0);
    setDone(false);
  }, []);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const runAlgorithm = useCallback(async () => {
    play();
    setDone(false);
    const arr = [...array];
    let w = 0;
    let comparisons = 0;

    setWrite(0);
    setRead(1);
    await sleep(speed);
    if (cancelRef.current) return;

    try {
      for (let r = 1; r < arr.length; r++) {
        if (cancelRef.current) break;

        setRead(r);
        setComparing(true);
        comparisons++;
        setComparisonCount(comparisons);
        await sleep(speed);
        if (cancelRef.current) break;

        if (arr[r] !== arr[w]) {
          w++;
          setOverwrite(w);
          await sleep(speed);
          if (cancelRef.current) break;

          arr[w] = arr[r];
          setArray([...arr]);
          setWrite(w);
          await sleep(speed);
          if (cancelRef.current) break;
          setOverwrite(null);
        }

        setComparing(false);
        await sleep(speed / 2);
        if (cancelRef.current) break;
      }

      if (!cancelRef.current) {
        setUniqueCount(w + 1);
        setDone(true);
      }
    } finally {
      stop();
      setComparing(false);
      setOverwrite(null);
    }
  }, [array, speed, sleep, play, stop, cancelRef]);

  const handleStart = useCallback(() => {
    if (isPaused) {
      play();
    } else if (!isPlaying && !done) {
      runAlgorithm();
    }
  }, [isPaused, isPlaying, done, play, runAlgorithm]);

  const handlePause = useCallback(() => {
    if (isPlaying && !isPaused) pause();
  }, [isPlaying, isPaused, pause]);

  const handleReset = useCallback(() => {
    resetControl();
    generateArray();
  }, [resetControl, generateArray]);

  const getCellColor = useCallback(
    (index) => {
      if (overwrite === index) return "bg-amber-400 text-gray-900";
      if (read === index && comparing) return "bg-yellow-500 text-gray-900";
      if (read === index) return "bg-blue-500 text-white";
      if (write === index) return "bg-purple-500 text-white";
      if (uniqueCount !== null && index < uniqueCount) return "bg-green-500 text-white";
      return "bg-gray-600 text-gray-200";
    },
    [read, write, comparing, overwrite, uniqueCount]
  );

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">
        Two Pointers: Remove Duplicates
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 shadow-inner">
          <p className="text-sm text-gray-400 mb-3">Array (sorted with duplicates)</p>
          <div className="flex flex-wrap justify-center gap-2 min-h-[80px] items-end">
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
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg font-bold text-lg shadow-md border-2 ${getCellColor(index)} ${
                    read === index || write === index
                      ? "border-[#FFD700] ring-2 ring-[#FFD700]/50"
                      : "border-transparent"
                  }`}
                  animate={{
                    scale: overwrite === index ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {value}
                </motion.div>
                <span className="text-xs text-gray-500 mt-1">i={index}</span>
                {read === index && (
                  <span className="text-xs font-bold text-blue-400 mt-0.5">read</span>
                )}
                {write === index && read !== index && (
                  <span className="text-xs font-bold text-purple-400 mt-0.5">write</span>
                )}
                {write === index && read === index && (
                  <span className="text-xs font-bold text-[#FFD700] mt-0.5">read/write</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <div className="bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
            <h3 className="font-semibold text-[#FFD700] mb-2">Stats</h3>
            <p className="text-gray-200 text-sm">
              Comparisons: <strong className="text-white">{comparisonCount}</strong>
            </p>
            {uniqueCount !== null && (
              <p className="text-gray-200 text-sm mt-1">
                Unique count: <strong className="text-green-400">{uniqueCount}</strong>
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border border-[#FFD700]/50" aria-hidden />
              <span className="text-gray-100">Read</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded border border-[#FFD700]/50" aria-hidden />
              <span className="text-gray-100">Write</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" aria-hidden />
              <span className="text-gray-100">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-400 rounded" aria-hidden />
              <span className="text-gray-100">Overwrite</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" aria-hidden />
              <span className="text-gray-100">Unique</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
        <button
          type="button"
          onClick={handleStart}
          disabled={done && !isPaused}
          className="px-6 py-2 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#7B75D4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          aria-label={isPaused ? "Resume" : isPlaying ? "Running" : done ? "Done" : "Start"}
        >
          {isPaused ? "Resume" : isPlaying ? "Running…" : done ? "Done" : "Play"}
        </button>

        {isPlaying && !isPaused && (
          <button
            type="button"
            onClick={handlePause}
            className="px-6 py-2 bg-[#FFD700] text-gray-900 rounded-lg font-semibold hover:bg-[#FFE44D] transition-colors shadow-md"
            aria-label="Pause"
          >
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
          aria-label="Reset"
        >
          Reset
        </button>

        <div className="flex items-center gap-3">
          <label htmlFor="twopointers-speed" className="text-gray-100 font-medium">
            Speed:
          </label>
          <input
            id="twopointers-speed"
            type="range"
            min="200"
            max="1200"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isPlaying}
            className="w-32"
            aria-valuemin={200}
            aria-valuemax={1200}
            aria-valuenow={speed}
            aria-label="Animation speed"
          />
          <span className="text-gray-100 text-sm w-12">{speed}ms</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
        <h3 className="font-semibold text-[#FFD700] mb-2">Invariant</h3>
        <p className="text-gray-200 text-sm">
          Everything before the <strong className="text-purple-400">write</strong> pointer is
          unique and in order. <strong className="text-blue-400">Read</strong> scans ahead;
          when we see a new value, we copy it to <strong className="text-purple-400">write</strong> and advance it.
        </p>
      </div>
    </div>
  );
}
