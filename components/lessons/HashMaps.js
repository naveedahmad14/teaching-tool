import { useState } from "react";
import { motion } from "framer-motion";
import HashMapVisualizer from "../HashMapVisualizer";
import FrequencyCounterVisualizer from "../FrequencyCounterVisualizer";
import HashMapTable from "../HashMapTable";

const TWO_SUM_ARRAY = [2, 7, 11, 15];
const TWO_SUM_TARGET = 9;

export default function HashMapsLesson() {
  const [array, setArray] = useState([...TWO_SUM_ARRAY]);
  const [target, setTarget] = useState(TWO_SUM_TARGET);
  const [mapEntries, setMapEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [lookupKey, setLookupKey] = useState(null);
  const [lookupFound, setLookupFound] = useState(null);
  const [insertKey, setInsertKey] = useState(null);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [activeLine, setActiveLine] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pseudocode = [
    { line: 1, code: "function twoSum(arr, target):", indent: 0 },
    { line: 2, code: "map = {}  // value → index", indent: 1 },
    { line: 3, code: "for i from 0 to arr.length - 1:", indent: 1 },
    { line: 4, code: "need = target - arr[i]", indent: 2 },
    { line: 5, code: "if need in map:", indent: 2 },
    { line: 6, code: "return [map[need], i]", indent: 3 },
    { line: 7, code: "map[arr[i]] = i  // store for later lookup", indent: 2 },
    { line: 8, code: "return []  // no solution", indent: 1 },
  ];

  const runAlgorithm = async () => {
    setRunning(true);
    setResult(null);
    const arr = array;
    const map = new Map();
    const entries = [];

    setMapEntries([]);
    setActiveLine(1);
    await sleep(speed);
    setActiveLine(2);
    await sleep(speed);
    setActiveLine(3);

    for (let i = 0; i < arr.length; i++) {
      setCurrentIndex(i);
      setActiveLine(4);
      const need = target - arr[i];
      setLookupKey(need);
      setLookupFound(null);
      await sleep(speed);

      setActiveLine(5);
      if (map.has(need)) {
        setLookupFound(true);
        setResult([map.get(need), i]);
        setActiveLine(6);
        await sleep(speed);
        setActiveLine(null);
        setRunning(false);
        return;
      }

      setLookupFound(false);
      await sleep(speed);
      setActiveLine(7);
      setInsertKey(arr[i]);
      map.set(arr[i], i);
      entries.push({ key: arr[i], value: i });
      setMapEntries([...entries]);
      await sleep(speed);
      setInsertKey(null);
      await sleep(speed / 2);
    }

    setActiveLine(8);
    await sleep(speed);
    setActiveLine(null);
    setRunning(false);
  };

  const handleReset = () => {
    setArray([...TWO_SUM_ARRAY]);
    setTarget(TWO_SUM_TARGET);
    setMapEntries([]);
    setCurrentIndex(null);
    setLookupKey(null);
    setLookupFound(null);
    setInsertKey(null);
    setResult(null);
    setActiveLine(null);
    setRunning(false);
  };

  const getArrayCellStyle = (index) => {
    if (result && (index === result[0] || index === result[1])) return "bg-[#FFD700] text-gray-900 font-bold";
    if (currentIndex === index) return "bg-blue-500 text-white ring-2 ring-[#FFD700]";
    return "bg-gray-500 text-white";
  };

  const highlightedMapKey = insertKey !== null ? insertKey : lookupFound ? lookupKey : null;
  const mapHighlightType = insertKey !== null ? "insert" : lookupFound ? "lookup" : null;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#625EC6] to-indigo-700 rounded-xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Hash Maps &amp; Sets</h1>
        <p className="text-xl opacity-90">
          Trade space for time: O(1) lookup and the Two Sum / Frequency Counter patterns
        </p>
      </div>

      {/* Try It First: Two Sum */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Try It First: Two Sum</h2>
        <p className="text-gray-700 mb-6">
          Use the visualiser to see how we build a hash map (value → index) and use O(1) lookup for <code>target - current</code>.
        </p>
        <HashMapVisualizer />
      </div>

      {/* The Problem: Two Sum */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">The Problem: Two Sum</h2>
        <p className="text-lg text-gray-700 mb-4">
          Given an array of integers and a <strong>target</strong>, return indices of two numbers that add up to target. Assume exactly one solution exists.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800">
          <p>Input: arr = [2, 7, 11, 15], target = 9</p>
          <p>Output: [0, 1] because arr[0] + arr[1] = 2 + 7 = 9</p>
        </div>
      </div>

      {/* Brute Force */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Brute Force: O(n²)</h2>
        <p className="text-gray-700 mb-4">
          For each index <code>i</code>, try every <code>j &gt; i</code> and check if <code>arr[i] + arr[j] === target</code>. Two nested loops → <strong>O(n²)</strong>.
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <p className="text-amber-900 font-semibold mb-1">Overlapping work</p>
          <p className="text-amber-800 text-sm">
            We keep re-scanning the array. If we could “remember” seen values and ask “is there an index where value = target − current?” in O(1), we’d do one pass.
          </p>
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Key Insight: Hash Map for O(1) Lookup</h2>
        <p className="text-gray-700 mb-4">
          Store each value we’ve seen with its index: <code>map[value] = index</code>. For the current element <code>arr[i]</code>, we need a pair with value <code>need = target - arr[i]</code>. If <code>need</code> is in the map, we’re done; otherwise add <code>arr[i] → i</code> and continue.
        </p>
        <div className="bg-[#16213E] rounded-lg p-4 border border-[#625EC6]/50">
          <h3 className="font-semibold text-[#FFD700] mb-2">Trade space for time</h3>
          <p className="text-gray-200 text-sm">
            We use O(n) extra space for the map but reduce time from O(n²) to <strong>O(n)</strong>. One pass, each lookup and insert is O(1) on average.
          </p>
        </div>
      </div>

      {/* Interactive Two Sum */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Interactive: Hash Map Building</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={runAlgorithm}
            disabled={running}
            className="px-6 py-3 bg-[#625EC6] text-white rounded-lg font-semibold hover:bg-[#7B75D4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {running ? "Running…" : "Start"}
          </button>
          <button onClick={handleReset} className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md">
            Reset
          </button>
          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-medium">Target:</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value) || 0)}
              disabled={running}
              className="w-20 px-2 py-1 rounded border border-gray-300"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-medium">Speed:</label>
            <input type="range" min="400" max="1200" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} disabled={running} className="w-32" />
            <span className="text-gray-600 text-sm">{speed}ms</span>
          </div>
        </div>
        {result && (
          <div className="mb-4 p-3 bg-[#FFD700]/20 rounded-lg border border-[#FFD700]/50">
            <p className="text-gray-800 font-semibold">Result: indices [{result[0]}, {result[1]}]</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 font-medium mb-3">Array</p>
            <div className="flex flex-wrap gap-2">
              {array.map((value, index) => (
                <motion.div
                  key={`cell-${index}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold shadow-md ${getArrayCellStyle(index)}`}
                  transition={{ duration: 0.2 }}
                >
                  {value}
                  <span className="text-xs opacity-80 block">i={index}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <HashMapTable
              entries={mapEntries}
              highlightedKey={highlightedMapKey}
              highlightType={mapHighlightType}
              title="map: value → index"
              keyLabel="Value"
              valueLabel="Index"
            />
            {lookupKey !== null && lookupFound === false && (
              <p className="mt-2 text-sm text-gray-500">Lookup {lookupKey} → not found</p>
            )}
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
          <h3 className="font-semibold text-white mb-4">Pseudocode</h3>
          <div className="font-mono text-sm">
            {pseudocode.map((line) => (
              <motion.div
                key={line.line}
                className={`py-1 px-3 rounded ${activeLine === line.line ? "bg-[#FFD700] text-gray-900 font-bold" : "text-gray-300"}`}
                style={{ paddingLeft: `${line.indent * 2 + 1}rem` }}
                transition={{ duration: 0.2 }}
              >
                {line.code}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Mistakes: Two Sum */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Common Mistakes (Two Sum)</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Using the same index twice</h3>
            <p className="text-gray-700 text-sm">
              We insert <code>arr[i] → i</code> <strong>after</strong> checking for <code>need</code>. If we inserted first, we might use the same element twice (e.g. target=6, arr[i]=3 would find 3 in the map and return [i, i]).
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Overwriting index on duplicates</h3>
            <p className="text-gray-700 text-sm">
              If the array has duplicate values, storing <code>map[value] = i</code> overwrites the previous index. For “return one pair” that’s usually fine; for “return all pairs” you’d need to store a list of indices per value.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Return order</h3>
            <p className="text-gray-700 text-sm">
              <code>map.get(need)</code> gives the earlier index; current index is <code>i</code>. Return <code>[map.get(need), i]</code> in that order to match “first occurrence” semantics.
            </p>
          </div>
        </div>
      </div>

      {/* When to use / When not */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">When to Use Hash Maps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-3">✓ Good for</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Fast lookup by key (O(1) average)</li>
              <li>• Counting frequency (value → count)</li>
              <li>• Detecting duplicates or “have we seen this?”</li>
              <li>• Two Sum, Valid Anagram, Group Anagrams, etc.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-700 mb-3">✗ When not to use</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• When you need sorted order (use tree/sort)</li>
              <li>• When O(1) space is required and n is huge</li>
              <li>• When keys have structure (e.g. range queries → prefix sum / segment tree)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Collision note */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Collision Handling</h2>
        <p className="text-gray-700 mb-4">
          Hash maps use a hash function to map keys to buckets. When two keys hash to the same bucket (collision), implementations use <strong>chaining</strong> (linked list per bucket) or <strong>open addressing</strong>. Average lookup remains O(1); worst case O(n). For interview problems we usually assume O(1) lookup/insert.
        </p>
      </div>

      {/* Second Example: Valid Anagram */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Second Example: Frequency Counter (Valid Anagram)</h2>
        <p className="text-gray-700 mb-4">
          <strong>Problem:</strong> Given two strings, return whether they are anagrams (same characters, same counts). Build a frequency map for each string (char → count), then compare the two maps.
        </p>
        <p className="text-gray-700 mb-6">
          This is the <strong>frequency counter</strong> pattern: use a hash map to count occurrences, then compare or use the counts.
        </p>
        <FrequencyCounterVisualizer />
      </div>

      {/* Practice */}
      <div className="bg-gradient-to-br from-[#625EC6]/10 to-indigo-50 rounded-xl shadow-lg p-8 border-2 border-[#625EC6]/30">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Practice</h2>
        <p className="text-gray-700 mb-4">
          For <code className="bg-white px-2 py-1 rounded">arr = [3, 2, 4], target = 6</code>, trace the hash map: what is in the map after each index, and when do we find the answer?
        </p>
        <div className="bg-white rounded-lg p-4">
          <p className="font-semibold mb-2">Solution:</p>
          <p className="text-gray-700 text-sm">
            {"i=0: need=3, not in map → map={3:0}. i=1: need=4, not in map → map={3:0, 2:1}. i=2: need=2, found at index 1 → return [1, 2]."}
          </p>
        </div>
      </div>
    </div>
  );
}
