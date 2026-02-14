import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function QuickSortVisualizer() {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [comparing, setComparing] = useState([]);
  const [pivot, setPivot] = useState(null);
  const [partitioning, setPartitioning] = useState([]);
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
    setPivot(null);
    setPartitioning([]);
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

  const quickSort = async () => {
    cancelledRef.current = false;
    pausedRef.current = false;
    setSorting(true);
    setPaused(false);
    setSorted(false);
    const arr = [...array];
    const newSortedIndices = [];

    const partition = async (low, high) => {
      if (cancelledRef.current) return null;
      
      const pivotValue = arr[high];
      setPivot(high);
      setPartitioning([low, high]);
      await sleep(speed);
      if (cancelledRef.current) return null;

      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (cancelledRef.current) break;
        
        if (cancelledRef.current) break;

        setComparing([j, high]);
        await sleep(speed);
        if (cancelledRef.current) break;

        if (arr[j] < pivotValue) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            setArray([...arr]);
            await sleep(speed);
            if (cancelledRef.current) break;
          }
        }
        setComparing([]);
      }

      if (cancelledRef.current) return null;

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(speed);
      if (cancelledRef.current) return null;

      newSortedIndices.push(i + 1);
      setSortedIndices([...newSortedIndices]);
      setPivot(null);
      setPartitioning([]);

      return i + 1;
    };

    const sort = async (low, high) => {
      if (cancelledRef.current) return;
      
      if (low < high) {
        const pi = await partition(low, high);
        if (cancelledRef.current || pi === null) return;
        await sort(low, pi - 1);
        if (cancelledRef.current) return;
        await sort(pi + 1, high);
      } else if (low === high) {
        newSortedIndices.push(low);
        setSortedIndices([...newSortedIndices]);
      }
    };

    try {
      await sort(0, arr.length - 1);
      
      if (!cancelledRef.current) {
        setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
        setSorted(true);
      }
    } finally {
      setSorting(false);
      setPaused(false);
      setComparing([]);
      setPivot(null);
      setPartitioning([]);
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
      quickSort();
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
    setPivot(null);
    setPartitioning([]);
    
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
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (pivot === index) return 'bg-purple-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (partitioning.length === 2 && index >= partitioning[0] && index <= partitioning[1]) {
      return 'bg-orange-400';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-8 mb-8 border-2 border-[#625EC6]/50">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Quick Sort Visualizer</h2>
      
      {/* Visualization Area */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6 shadow-inner">
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
                  scale: pivot === index ? 1.15 : comparing.includes(index) ? 1.1 : 1,
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400 rounded" aria-hidden></div>
          <span className="text-gray-100">Partition Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" aria-hidden></div>
          <span className="text-gray-100">Sorted</span>
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
          <label className="text-gray-100 font-medium">Speed:</label>
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
          <span className="text-gray-100 text-sm w-12">{speed}ms</span>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="mt-6 p-4 bg-[#16213E] rounded-lg border border-[#625EC6]/50">
        <h3 className="font-semibold text-[#FFD700] mb-2">How Quick Sort Works:</h3>
        <p className="text-gray-200 text-sm">
          Quick Sort selects a pivot element and partitions the array so all elements smaller than the pivot 
          are on the left and larger elements are on the right. It then recursively sorts the sub-arrays. 
          Time complexity: O(n log n) average, O(n²) worst case.
        </p>
      </div>
    </div>
  );
}