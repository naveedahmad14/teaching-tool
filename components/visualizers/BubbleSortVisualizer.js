import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);

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
  } = useVisualization({ initialSpeed: 500 });

  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setArray(newArray);
    setSorted(false);
    setSortedIndices([]);
    setComparing([]);
    setSwapping([]);
  }, []);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const bubbleSort = useCallback(async () => {
    play();
    setSorted(false);
    const arr = [...array];
    const n = arr.length;
    const newSortedIndices = [];

    try {
      for (let i = 0; i < n - 1; i++) {
        if (cancelRef.current) break;

        for (let j = 0; j < n - i - 1; j++) {
          if (cancelRef.current) break;

          setComparing([j, j + 1]);
          await sleep(speed);
          if (cancelRef.current) break;

          if (arr[j] > arr[j + 1]) {
            setSwapping([j, j + 1]);
            await sleep(speed);
            if (cancelRef.current) break;

            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);

            await sleep(speed);
            if (cancelRef.current) break;
            setSwapping([]);
          }

          setComparing([]);
        }
        if (cancelRef.current) break;

        newSortedIndices.push(n - i - 1);
        setSortedIndices([...newSortedIndices]);
      }

      if (!cancelRef.current) {
        newSortedIndices.push(0);
        setSortedIndices([...newSortedIndices]);
        setSorted(true);
      }
    } finally {
      stop();
      setComparing([]);
      setSwapping([]);
    }
  }, [array, speed, sleep, play, stop, cancelRef]);

  const handleStart = useCallback(() => {
    if (isPaused) {
      play();
    } else if (!isPlaying && !sorted) {
      bubbleSort();
    }
  }, [isPaused, isPlaying, sorted, play, bubbleSort]);

  const handlePause = useCallback(() => {
    if (isPlaying && !isPaused) {
      pause();
    }
  }, [isPlaying, isPaused, pause]);

  const handleReset = useCallback(() => {
    resetControl();
    generateArray();
  }, [resetControl, generateArray]);

  const getBarColor = useCallback(
    (index) => {
      if (sortedIndices.includes(index)) return "bg-green-500";
      if (swapping.includes(index)) return "bg-red-500";
      if (comparing.includes(index)) return "bg-yellow-500";
      return "bg-blue-500";
    },
    [sortedIndices, swapping, comparing]
  );

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-899 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">
        Bubble Sort Visualizer
      </h2>

      <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-inner">
        <div className="flex items-end justify-center gap-2 h-64">
          {array.map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              className="flex flex-col items-center justify-end transition-colors duration-300"
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                layout: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.2 },
              }}
            >
              <motion.div
                className={`w-12 ${getBarColor(index)} rounded-t-lg relative`}
                style={{ height: `${value * 2}px` }}
                animate={{
                  scale: swapping.includes(index) ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-100">
                  {value}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" aria-hidden />
          <span className="text-gray-100">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" aria-hidden />
          <span className="text-gray-100">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" aria-hidden />
          <span className="text-gray-100">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" aria-hidden />
          <span className="text-gray-100">Sorted</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          type="button"
          onClick={handleStart}
          disabled={sorted && !isPaused}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          aria-label={isPaused ? "Resume" : isPlaying ? "Sorting in progress" : sorted ? "Completed" : "Start sort"}
        >
          {isPaused ? "Resume" : isPlaying ? "Sorting..." : sorted ? "Completed" : "Start Sort"}
        </button>

        {isPlaying && !isPaused && (
          <button
            type="button"
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
            aria-label="Pause"
          >
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
          aria-label="Reset and generate new array"
        >
          Reset
        </button>

        <div className="flex items-center gap-3">
          <label htmlFor="bubble-speed" className="text-gray-100 font-medium">
            Speed:
          </label>
          <input
            id="bubble-speed"
            type="range"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isPlaying}
            className="w-32"
            aria-valuemin={100}
            aria-valuemax={1000}
            aria-valuenow={speed}
            aria-label="Animation speed in milliseconds"
          />
          <span className="text-gray-100 text-sm w-12">{speed}ms</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
        <h3 className="font-semibold text-[#FFD700] mb-2">How Bubble Sort Works:</h3>
        <p className="text-gray-200 text-sm">
          Bubble Sort repeatedly compares adjacent elements and swaps them if they
          are in the wrong order. The largest elements &quot;bubble up&quot; to the end
          with each pass. Time complexity: O(n²)
        </p>
      </div>
    </div>
  );
}
