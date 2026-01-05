import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MergeSortVisualizer() {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [comparing, setComparing] = useState([]);
  const [merging, setMerging] = useState([]);
  const [leftSubarray, setLeftSubarray] = useState([]);
  const [rightSubarray, setRightSubarray] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [speed, setSpeed] = useState(500);
  
  const cancelledRef = useRef(false);
  const pausedRef = useRef(false);
  const pauseResumeRef = useRef(null);

  // Initialize array with random values
  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => 
      Math.floor(Math.random() * 90) + 10
    );
    setArray(newArray);
    setSorted(false);
    setSortedIndices([]);
    setComparing([]);
    setMerging([]);
    setLeftSubarray([]);
    setRightSubarray([]);
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

  const mergeSort = async () => {
    cancelledRef.current = false;
    pausedRef.current = false;
    setSorting(true);
    setPaused(false);
    setSorted(false);
    const arr = [...array];

    const merge = async (arr, left, mid, right) => {
      if (cancelledRef.current) return;
      
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      const leftIndices = Array.from({ length: mid - left + 1 }, (_, i) => left + i);
      const rightIndices = Array.from({ length: right - mid }, (_, i) => mid + 1 + i);
      
      setLeftSubarray(leftIndices);
      setRightSubarray(rightIndices);
      setMerging([left, right]);
      await sleep(speed);
      if (cancelledRef.current) return;

      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (cancelledRef.current) break;
        
        if (cancelledRef.current) break;

        setComparing([left + i, mid + 1 + j]);
        await sleep(speed);
        if (cancelledRef.current) break;

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }
        setArray([...arr]);
        await sleep(speed);
        if (cancelledRef.current) break;
        k++;
      }

      while (i < leftArr.length && !cancelledRef.current) {
        setComparing([left + i]);
        arr[k] = leftArr[i];
        setArray([...arr]);
        await sleep(speed);
        if (cancelledRef.current) break;
        i++;
        k++;
      }

      while (j < rightArr.length && !cancelledRef.current) {
        setComparing([mid + 1 + j]);
        arr[k] = rightArr[j];
        setArray([...arr]);
        await sleep(speed);
        if (cancelledRef.current) break;
        j++;
        k++;
      }

      if (cancelledRef.current) return;

      setComparing([]);
      setLeftSubarray([]);
      setRightSubarray([]);
      
      const newSorted = Array.from({ length: right - left + 1 }, (_, i) => left + i);
      setSortedIndices(prev => [...new Set([...prev, ...newSorted])]);
      await sleep(speed);
      if (cancelledRef.current) return;
      setMerging([]);
    };

    const sort = async (arr, left, right) => {
      if (cancelledRef.current) return;
      
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        await sort(arr, left, mid);
        if (cancelledRef.current) return;
        await sort(arr, mid + 1, right);
        if (cancelledRef.current) return;
        await merge(arr, left, mid, right);
      }
    };

    try {
      await sort(arr, 0, arr.length - 1);
      
      if (!cancelledRef.current) {
        setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
        setSorted(true);
      }
    } finally {
      setSorting(false);
      setPaused(false);
      setComparing([]);
      setMerging([]);
      setLeftSubarray([]);
      setRightSubarray([]);
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
    } else if (!sorting && !sorted) {
      mergeSort();
    }
  };

  const handlePause = () => {
    if (sorting && !pausedRef.current) {
      pausedRef.current = true;
      setPaused(true);
    }
  };

  const handleReset = () => {
    cancelledRef.current = true;
    pausedRef.current = false;
    setSorting(false);
    setPaused(false);
    setComparing([]);
    setMerging([]);
    setLeftSubarray([]);
    setRightSubarray([]);
    
    if (pauseResumeRef.current?.timeoutId) {
      clearTimeout(pauseResumeRef.current.timeoutId);
    }
    if (pauseResumeRef.current?.resolve) {
      pauseResumeRef.current.resolve();
    }
    pauseResumeRef.current = null;
    
    generateArray();
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index) && !leftSubarray.includes(index) && !rightSubarray.includes(index)) {
      return 'bg-green-500';
    }
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (leftSubarray.includes(index)) return 'bg-cyan-500';
    if (rightSubarray.includes(index)) return 'bg-pink-500';
    if (merging.length === 2 && index >= merging[0] && index <= merging[1]) {
      return 'bg-indigo-400';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Merge Sort Visualizer</h2>
      
      {/* Visualization Area */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-inner">
        <div className="flex items-end justify-center gap-2 h-64">
          {array.map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              className={`flex flex-col items-center justify-end transition-colors duration-300`}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                layout: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.2 }
              }}
            >
              <motion.div
                className={`w-12 ${getBarColor(index)} rounded-t-lg relative`}
                style={{ height: `${value * 2}px` }}
                animate={{
                  scale: comparing.includes(index) ? 1.15 : 
                         (leftSubarray.includes(index) || rightSubarray.includes(index)) ? 1.08 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
                  {value}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-400 rounded"></div>
          <span className="text-gray-700">Merge Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-cyan-500 rounded"></div>
          <span className="text-gray-700">Left Subarray</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span className="text-gray-700">Right Subarray</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-700">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700">Sorted</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={handleStart}
          disabled={sorted && !paused}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {paused ? 'Resume' : sorting ? 'Sorting...' : sorted ? 'Completed' : 'Start Sort'}
        </button>
        
        {sorting && !paused && (
          <button
            onClick={handlePause}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
          >
            ⏸ Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-md"
        >
          Reset
        </button>

        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-medium">Speed:</label>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={sorting}
            className="w-32"
          />
          <span className="text-gray-600 text-sm w-12">{speed}ms</span>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">How Merge Sort Works:</h3>
        <p className="text-blue-800 text-sm">
          Merge Sort divides the array into two halves, recursively sorts each half, and then merges the 
          sorted halves back together. It uses a divide-and-conquer approach for consistent performance. 
          Time complexity: O(n log n) in all cases.
        </p>
      </div>
    </div>
  );
}