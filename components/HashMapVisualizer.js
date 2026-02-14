import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";
import HashMapTable from "./HashMapTable";

const DEFAULT_ARRAY = [2, 7, 11, 15];
const DEFAULT_TARGET = 9;

export default function HashMapVisualizer() {
  const [array, setArray] = useState([...DEFAULT_ARRAY]);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [mapEntries, setMapEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [lookupKey, setLookupKey] = useState(null);
  const [lookupFound, setLookupFound] = useState(null);
  const [insertKey, setInsertKey] = useState(null);
  const [result, setResult] = useState(null);
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
    setResult(null);
    const arr = array;
    const map = new Map();
    const entries = [];

    setMapEntries([]);
    await sleep(speed);
    if (cancelRef.current) return;

    try {
      for (let i = 0; i < arr.length; i++) {
        if (cancelRef.current) break;

        setCurrentIndex(i);
        const need = target - arr[i];
        setLookupKey(need);
        setLookupFound(null);
        await sleep(speed);
        if (cancelRef.current) break;

        if (map.has(need)) {
          setLookupFound(true);
          setResult([map.get(need), i]);
          await sleep(speed * 1.5);
          if (!cancelRef.current) setDone(true);
          break;
        }

        setLookupFound(false);
        await sleep(speed);
        if (cancelRef.current) break;

        setInsertKey(arr[i]);
        map.set(arr[i], i);
        entries.push({ key: arr[i], value: i });
        setMapEntries([...entries]);
        await sleep(speed);
        if (cancelRef.current) break;

        setInsertKey(null);
        setLookupKey(null);
        await sleep(speed / 2);
        if (cancelRef.current) break;
      }

      if (!cancelRef.current && !result) setDone(true);
    } finally {
      stop();
      setCurrentIndex(null);
      setLookupKey(null);
      setLookupFound(null);
      setInsertKey(null);
    }
  }, [array, target, speed, sleep, play, stop, cancelRef]);

  const handlePlay = useCallback(() => {
    if (isPaused) play();
    else if (!isPlaying && !done) runAlgorithm();
  }, [isPaused, isPlaying, done, play, runAlgorithm]);

  const handleReset = useCallback(() => {
    resetControl();
    setArray([...DEFAULT_ARRAY]);
    setTarget(DEFAULT_TARGET);
    setMapEntries([]);
    setCurrentIndex(null);
    setLookupKey(null);
    setLookupFound(null);
    setInsertKey(null);
    setResult(null);
    setDone(false);
  }, [resetControl]);

  const getArrayCellStyle = (index) => {
    if (result && (index === result[0] || index === result[1]))
      return "bg-[#FFD700] text-gray-900 font-bold";
    if (currentIndex === index) return "bg-blue-500 text-white ring-2 ring-[#FFD700]";
    return "bg-gray-600 text-gray-200";
  };

  const highlightedMapKey =
    insertKey !== null ? insertKey : lookupFound ? lookupKey : null;
  const mapHighlightType =
    insertKey !== null ? "insert" : lookupFound ? "lookup" : null;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Two Sum: Hash Map</h2>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="text-gray-200 text-sm font-medium">Target:</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(Number(e.target.value) || 0)}
          disabled={isPlaying || currentIndex !== null}
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-lg p-6 shadow-inner">
          <p className="text-gray-400 text-sm mb-3">Array</p>
          <div className="flex flex-wrap gap-2">
            {array.map((value, index) => (
              <motion.div
                key={`${index}-${value}`}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg font-bold text-lg shadow-md ${getArrayCellStyle(index)}`}
                transition={{ duration: 0.2 }}
              >
                {value}
                <span className="text-xs opacity-80 mt-0.5">i={index}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Need: target − current = {target} − {currentIndex !== null ? array[currentIndex] : "?"} ={" "}
            {currentIndex !== null ? target - array[currentIndex] : "—"}
          </p>
        </div>

        <div className="min-h-[200px]">
          <HashMapTable
            entries={mapEntries}
            highlightedKey={highlightedMapKey}
            highlightType={
              insertKey !== null ? "insert" : lookupFound ? "lookup" : lookupKey !== null ? "current" : null
            }
            title="map: value → index"
            keyLabel="Value"
            valueLabel="Index"
          />
          {lookupKey !== null && lookupFound === false && (
            <p className="mt-2 text-sm text-gray-400">
              Lookup <span className="font-mono text-red-400">{lookupKey}</span> → not found
            </p>
          )}
          {result && (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 text-[#FFD700] font-semibold"
            >
              Found: indices [{result[0]}, {result[1]}]
            </motion.p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center text-xs sm:text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 ring-1 ring-[#FFD700]" aria-hidden />
          <span className="text-gray-100">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" aria-hidden />
          <span className="text-gray-100">Insert</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#FFD700]" aria-hidden />
          <span className="text-gray-100">Lookup success</span>
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
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
        >
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
    </div>
  );
}
