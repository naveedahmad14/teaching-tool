import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";
import HashMapTable from "./HashMapTable";

const DEFAULT_S1 = "anagram";
const DEFAULT_S2 = "nagaram";

function buildFreqMap(s) {
  const m = new Map();
  for (const c of s) m.set(c, (m.get(c) || 0) + 1);
  return m;
}

function entriesFromMap(m) {
  return Array.from(m.entries()).map(([key, value]) => ({ key, value }));
}

export default function FrequencyCounterVisualizer() {
  const [s1, setS1] = useState(DEFAULT_S1);
  const [s2, setS2] = useState(DEFAULT_S2);
  const [freq1, setFreq1] = useState([]);
  const [freq2, setFreq2] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | building1 | building2 | compare | done
  const [currentChar, setCurrentChar] = useState(null);
  const [isAnagram, setIsAnagram] = useState(null);
  const [done, setDone] = useState(false);

  const { speed, setSpeed, isPlaying, isPaused, sleep, play, pause, reset: resetControl, stop, cancelRef } = useVisualization({ initialSpeed: 600 });

  const runAlgorithm = useCallback(async () => {
    play();
    setDone(false);
    setFreq1([]);
    setFreq2([]);
    setPhase("building1");
    setCurrentChar(null);
    setIsAnagram(null);
    const m1 = new Map();
    const m2 = new Map();

    await sleep(speed);
    if (cancelRef.current) return;

    try {
      for (let i = 0; i < s1.length; i++) {
        if (cancelRef.current) break;
        const c = s1[i];
        setCurrentChar(c);
        m1.set(c, (m1.get(c) || 0) + 1);
        setFreq1(entriesFromMap(m1));
        await sleep(speed);
        if (cancelRef.current) break;
      }
      setCurrentChar(null);
      setPhase("building2");
      await sleep(speed);
      if (cancelRef.current) return;

      for (let i = 0; i < s2.length; i++) {
        if (cancelRef.current) break;
        const c = s2[i];
        setCurrentChar(c);
        m2.set(c, (m2.get(c) || 0) + 1);
        setFreq2(entriesFromMap(m2));
        await sleep(speed);
        if (cancelRef.current) break;
      }
      setCurrentChar(null);
      setPhase("compare");
      await sleep(speed);
      if (cancelRef.current) return;

      const same = m1.size === m2.size && Array.from(m1.entries()).every(([k, v]) => m2.get(k) === v);
      setIsAnagram(same);
      setDone(true);
    } finally {
      stop();
      setPhase("done");
      setCurrentChar(null);
    }
  }, [s1, s2, speed, sleep, play, stop, cancelRef]);

  const handlePlay = useCallback(() => {
    if (isPaused) play();
    else if (!isPlaying && !done) runAlgorithm();
  }, [isPaused, isPlaying, done, play, runAlgorithm]);

  const handleReset = useCallback(() => {
    resetControl();
    setS1(DEFAULT_S1);
    setS2(DEFAULT_S2);
    setFreq1([]);
    setFreq2([]);
    setPhase("idle");
    setCurrentChar(null);
    setIsAnagram(null);
    setDone(false);
  }, [resetControl]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Valid Anagram: Frequency Counter</h2>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-400 text-sm">String 1</label>
          <input
            type="text"
            value={s1}
            onChange={(e) => setS1(e.target.value.replace(/[^a-z]/gi, "").toLowerCase())}
            disabled={isPlaying}
            className="w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
            maxLength={20}
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm">String 2</label>
          <input
            type="text"
            value={s2}
            onChange={(e) => setS2(e.target.value.replace(/[^a-z]/gi, "").toLowerCase())}
            disabled={isPlaying}
            className="w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
            maxLength={20}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-400 text-sm mb-2">Frequency map 1: &quot;{s1}&quot;</p>
          <HashMapTable
            entries={freq1}
            highlightedKey={currentChar && phase === "building1" ? currentChar : null}
            highlightType="insert"
            keyLabel="Char"
            valueLabel="Count"
            title=""
          />
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-2">Frequency map 2: &quot;{s2}&quot;</p>
          <HashMapTable
            entries={freq2}
            highlightedKey={currentChar && phase === "building2" ? currentChar : null}
            highlightType="insert"
            keyLabel="Char"
            valueLabel="Count"
            title=""
          />
        </div>
      </div>

      {phase === "compare" || done ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-[#16213E] border border-[#625EC6]/50"
        >
          <p className="text-gray-200">
            Compare maps: same keys and same counts?{" "}
            {isAnagram === null ? "…" : isAnagram ? (
              <span className="text-[#FFD700] font-bold">Yes → Valid anagram</span>
            ) : (
              <span className="text-red-400 font-bold">No → Not an anagram</span>
            )}
          </p>
        </motion.div>
      ) : null}

      <div className="flex flex-wrap gap-4 items-center justify-center mt-6">
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
            min="300"
            max="1000"
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
