import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LinearSearchVisualizer() {
  const [array, setArray] = useState([]);
  const [searching, setSearching] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [target, setTarget] = useState('');
  const [searchComplete, setSearchComplete] = useState(false);
  const [visited, setVisited] = useState([]);
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
    resetSearch();
  };

  const resetSearch = () => {
    setCurrentIndex(null);
    setFoundIndex(null);
    setSearchComplete(false);
    setVisited([]);
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

  const linearSearch = async () => {
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
    setVisited([]);

    let found = false;

    try {
      for (let i = 0; i < array.length; i++) {
        if (cancelledRef.current) break;
        
        if (cancelledRef.current) break;

        setCurrentIndex(i);
        await sleep(speed);
        if (cancelledRef.current) break;

        if (array[i] === targetNum) {
          setFoundIndex(i);
          found = true;
          await sleep(speed * 1.5);
          break;
        }

        setVisited(prev => [...prev, i]);
        await sleep(speed / 2);
        if (cancelledRef.current) break;
      }

      if (!cancelledRef.current) {
        setCurrentIndex(null);
        setSearchComplete(true);
        if (!found) {
          await sleep(speed);
        }
      }
    } finally {
      setSearching(false);
      setPaused(false);
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
      linearSearch();
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
    setVisited([]);
    
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
    if (currentIndex === index) return 'bg-yellow-500';
    if (visited.includes(index)) return 'bg-red-400';
    return 'bg-blue-500';
  };

  const getBarLabel = (index) => {
    if (foundIndex === index) return '✓ Found';
    if (currentIndex === index) return 'Checking...';
    if (visited.includes(index)) return '✗';
    return '';
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Linear Search Visualiser</h2>
      
      {/* Search Input */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-inner">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <label className="text-gray-700 font-medium">Search for:</label>
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
                ✓ Found {target} at index {foundIndex}! ({visited.length + 1} comparisons)
              </p>
            ) : (
              <p className="text-red-600 font-semibold text-lg">
                ✗ {target} not found in array. ({array.length} comparisons)
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Visualization Area */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-inner">
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
                  scale: currentIndex === index ? 1.2 : foundIndex === index ? 1.15 : 1,
                  rotateY: currentIndex === index ? [0, 5, -5, 0] : 0,
                }}
                transition={{ 
                  duration: 0.3,
                  rotateY: { duration: 0.5, repeat: currentIndex === index ? Infinity : 0 }
                }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
                  {value}
                </span>
                {getBarLabel(index) && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap"
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
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Not Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-700">Currently Checking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span className="text-gray-700">Checked (Not Match)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700">Found</span>
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
          <label className="text-gray-700 font-medium">Speed:</label>
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
          <span className="text-gray-600 text-sm w-12">{speed}ms</span>
        </div>
      </div>

      {/* Algorithm Explanation */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">How Linear Search Works:</h3>
        <p className="text-blue-800 text-sm">
          Linear Search checks each element in the array sequentially from start to end until it finds 
          the target value or reaches the end of the array. It's simple but can be slow for large arrays. 
          Time complexity: O(n) - worst case checks all n elements.
        </p>
      </div>
    </div>
  );
}