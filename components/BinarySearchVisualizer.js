import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState([]);
  const [searching, setSearching] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [target, setTarget] = useState('');
  const [searchComplete, setSearchComplete] = useState(false);
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [eliminated, setEliminated] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [comparisonCount, setComparisonCount] = useState(0);
  
  const cancelledRef = useRef(false);
  const pausedRef = useRef(false);
  const pauseResumeRef = useRef(null);

  // Initialize array with sorted random values
  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => 
      Math.floor(Math.random() * 90) + 10
    ).sort((a, b) => a - b);
    setArray(newArray);
    resetSearch();
  };

  const resetSearch = () => {
    setCurrentIndex(null);
    setFoundIndex(null);
    setSearchComplete(false);
    setLeft(null);
    setRight(null);
    setEliminated([]);
    setComparisonCount(0);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = async (ms) => {
    if (cancelledRef.current) return;
    
    return new Promise(resolve => {
      const startTime = Date.now();
      let remaining = ms;
      let timeoutId = null;
      
      const tick = () => {
        if (cancelledRef.current) {
          if (timeoutId) clearTimeout(timeoutId);
          resolve();
          return;
        }
        
        if (pausedRef.current) {
          pauseResumeRef.current = { 
            resolve: () => {
              const elapsed = Date.now() - startTime;
              remaining = ms - elapsed;
              if (remaining > 0 && !cancelledRef.current && !pausedRef.current) {
                timeoutId = setTimeout(() => {
                  if (!cancelledRef.current) resolve();
                }, remaining);
              } else if (!pausedRef.current) {
                resolve();
              }
            },
            startTime,
            remaining
          };
          return;
        }
        
        const elapsed = Date.now() - startTime;
        remaining = ms - elapsed;
        
        if (remaining <= 0) {
          resolve();
        } else {
          timeoutId = setTimeout(tick, Math.min(remaining, 50));
        }
      };
      
      timeoutId = setTimeout(tick, Math.min(ms, 50));
      pauseResumeRef.current = { resolve, timeoutId, startTime, remaining: ms };
    });
  };

  const waitForResume = async () => {
    return new Promise(resolve => {
      pauseResumeRef.current = { ...pauseResumeRef.current, resolve };
    });
  };

  const binarySearch = async () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) {
      alert('Please enter a valid number to search');
      return;
    }

    cancelledRef.current = false;
    pausedRef.current = false;
    setSearching(true);
    setPaused(false);
    setSearchComplete(false);
    setFoundIndex(null);
    setEliminated([]);
    setComparisonCount(0);

    let l = 0;
    let r = array.length - 1;
    let found = false;
    let comparisons = 0;

    try {
      while (l <= r) {
        if (cancelledRef.current) break;
        
        if (cancelledRef.current) break;

        setLeft(l);
        setRight(r);
        await sleep(speed);
        if (cancelledRef.current) break;

        const mid = Math.floor((l + r) / 2);
        setCurrentIndex(mid);
        comparisons++;
        setComparisonCount(comparisons);
        await sleep(speed * 1.5);
        if (cancelledRef.current) break;

        if (array[mid] === targetNum) {
          setFoundIndex(mid);
          found = true;
          await sleep(speed * 2);
          break;
        } else if (array[mid] < targetNum) {
          const newEliminated = Array.from({ length: mid - l + 1 }, (_, i) => l + i);
          setEliminated(prev => [...prev, ...newEliminated]);
          l = mid + 1;
          await sleep(speed);
          if (cancelledRef.current) break;
        } else {
          const newEliminated = Array.from({ length: r - mid + 1 }, (_, i) => mid + i);
          setEliminated(prev => [...prev, ...newEliminated]);
          r = mid - 1;
          await sleep(speed);
          if (cancelledRef.current) break;
        }
        
        setCurrentIndex(null);
        await sleep(speed / 2);
        if (cancelledRef.current) break;
      }

      if (!cancelledRef.current) {
        setLeft(null);
        setRight(null);
        setCurrentIndex(null);
        setSearchComplete(true);
        if (!found) {
          await sleep(speed);
        }
      }
    } finally {
      setSearching(false);
      setPaused(false);
      setLeft(null);
      setRight(null);
      setCurrentIndex(null);
      if (pauseResumeRef.current?.timeoutId) {
        clearTimeout(pauseResumeRef.current.timeoutId);
      }
    }
  };

  const handleStart = () => {
    if (pausedRef.current) {
      pausedRef.current = false;
      setPaused(false);
      if (pauseResumeRef.current?.resolve) {
        pauseResumeRef.current.resolve();
        pauseResumeRef.current = null;
      }
    } else if (!searching && target) {
      binarySearch();
    }
  };

  const handlePause = () => {
    if (searching && !pausedRef.current) {
      pausedRef.current = true;
      setPaused(true);
    }
  };

  const handleReset = () => {
    cancelledRef.current = true;
    pausedRef.current = false;
    setSearching(false);
    setPaused(false);
    setCurrentIndex(null);
    setFoundIndex(null);
    setLeft(null);
    setRight(null);
    setEliminated([]);
    
    if (pauseResumeRef.current?.timeoutId) {
      clearTimeout(pauseResumeRef.current.timeoutId);
    }
    if (pauseResumeRef.current?.resolve) {
      pauseResumeRef.current.resolve();
    }
    pauseResumeRef.current = null;
    
    generateArray();
    setTarget('');
  };

  const getBarColor = (index) => {
    if (foundIndex === index) return 'bg-green-500';
    if (currentIndex === index) return 'bg-purple-500';
    if (eliminated.includes(index)) return 'bg-gray-400';
    if (left !== null && right !== null && index >= left && index <= right) {
      return 'bg-blue-500';
    }
    return 'bg-gray-300';
  };

  const getBarLabel = (index) => {
    if (foundIndex === index) return '✓ Found';
    if (currentIndex === index) return 'Mid';
    if (index === left) return 'L';
    if (index === right) return 'R';
    return '';
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Binary Search Visualizer</h2>
      
      {/* Search Input */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6 shadow-inner">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <label className="text-gray-100 font-medium">Search for:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={searching}
            placeholder="Enter a number"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleStart}
            disabled={(!target && !paused) || (searchComplete && !paused)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {paused ? 'Resume' : searching ? 'Searching...' : 'Start Search'}
          </button>
          {searching && !paused && (
            <button
              onClick={handlePause}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
            >
              ⏸ Pause
            </button>
          )}
        </div>

        {searchComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            {foundIndex !== null ? (
              <p className="text-green-600 font-semibold text-lg">
                ✓ Found {target} at index {foundIndex}! (Only {comparisonCount} comparisons)
              </p>
            ) : (
              <p className="text-red-600 font-semibold text-lg">
                ✗ {target} not found in array. ({comparisonCount} comparisons)
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Visualization Area */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-inner">
        <div className="flex items-end justify-center gap-2 h-64">
          {array.map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              className={`flex flex-col items-center justify-end transition-colors duration-300`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                opacity: { duration: 0.2 }
              }}
            >
              <motion.div
                className={`w-12 ${getBarColor(index)} rounded-t-lg relative`}
                style={{ height: `${value * 2}px` }}
                animate={{
                  scale: currentIndex === index ? 1.25 : 
                         foundIndex === index ? 1.2 : 
                         (index === left || index === right) ? 1.1 : 
                         eliminated.includes(index) ? 0.9 : 1,
                  opacity: eliminated.includes(index) ? 0.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-100">
                  {value}
                </span>
                {getBarLabel(index) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap ${
                      currentIndex === index ? 'text-purple-600' :
                      foundIndex === index ? 'text-green-600' :
                      'text-blue-600'
                    }`}
                  >
                    {getBarLabel(index)}
                  </motion.span>
                )}
              </motion.div>
              <span className="text-xs text-gray-500 mt-8">idx {index}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Not in Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Search Range (L to R)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Middle (Checking)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded" aria-hidden></div>
          <span className="text-gray-100">Eliminated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Found</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
        >
          Generate New Array
        </button>

        <div className="flex items-center gap-3">
          <label className="text-gray-100 font-medium">Speed:</label>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={searching}
            className="w-32"
          />
          <span className="text-gray-100 text-sm w-12">{speed}ms</span>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="mt-6 p-4 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
        <h3 className="font-semibold text-[#FFD700] mb-2">How Binary Search Works:</h3>
        <p className="text-gray-200 text-sm mb-2">
          Binary Search works on <strong>sorted arrays</strong> by repeatedly dividing the search range in half. 
          It compares the middle element with the target and eliminates half of the remaining elements each time.
        </p>
        <p className="text-gray-200 text-sm">
          Time complexity: O(log n) - much faster than Linear Search O(n) for large arrays!
        </p>
      </div>
    </div>
  );
}