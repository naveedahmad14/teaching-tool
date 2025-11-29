import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState([]);
  const [searching, setSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [target, setTarget] = useState('');
  const [searchComplete, setSearchComplete] = useState(false);
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [eliminated, setEliminated] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [comparisonCount, setComparisonCount] = useState(0);

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

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const binarySearch = async () => {
    const targetNum = parseInt(target);
    if (isNaN(targetNum)) {
      alert('Please enter a valid number to search');
      return;
    }

    setSearching(true);
    setSearchComplete(false);
    setFoundIndex(null);
    setEliminated([]);
    setComparisonCount(0);

    let l = 0;
    let r = array.length - 1;
    let found = false;
    let comparisons = 0;

    while (l <= r) {
      setLeft(l);
      setRight(r);
      await sleep(speed);

      const mid = Math.floor((l + r) / 2);
      setCurrentIndex(mid);
      comparisons++;
      setComparisonCount(comparisons);
      await sleep(speed * 1.5);

      if (array[mid] === targetNum) {
        setFoundIndex(mid);
        found = true;
        await sleep(speed * 2);
        break;
      } else if (array[mid] < targetNum) {
        // Eliminate left half
        const newEliminated = Array.from({ length: mid - l + 1 }, (_, i) => l + i);
        setEliminated(prev => [...prev, ...newEliminated]);
        l = mid + 1;
        await sleep(speed);
      } else {
        // Eliminate right half
        const newEliminated = Array.from({ length: r - mid + 1 }, (_, i) => mid + i);
        setEliminated(prev => [...prev, ...newEliminated]);
        r = mid - 1;
        await sleep(speed);
      }
      
      setCurrentIndex(null);
      await sleep(speed / 2);
    }

    setLeft(null);
    setRight(null);
    setCurrentIndex(null);
    setSearchComplete(true);
    setSearching(false);

    if (!found) {
      await sleep(speed);
    }
  };

  const handleStart = () => {
    if (!searching && target) {
      binarySearch();
    }
  };

  const handleReset = () => {
    setSearching(false);
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
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Binary Search Visualiser</h2>
      
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
            disabled={searching || !target}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {searching ? 'Searching...' : 'Start Search'}
          </button>
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
                  scale: currentIndex === index ? 1.25 : 
                         foundIndex === index ? 1.2 : 
                         (index === left || index === right) ? 1.1 : 
                         eliminated.includes(index) ? 0.9 : 1,
                  opacity: eliminated.includes(index) ? 0.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
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
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-700">Not in Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Search Range (L to R)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-gray-700">Middle (Checking)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-gray-700">Eliminated</span>
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
        <h3 className="font-semibold text-blue-900 mb-2">How Binary Search Works:</h3>
        <p className="text-blue-800 text-sm mb-2">
          Binary Search works on <strong>sorted arrays</strong> by repeatedly dividing the search range in half. 
          It compares the middle element with the target and eliminates half of the remaining elements each time.
        </p>
        <p className="text-blue-800 text-sm">
          Time complexity: O(log n) - much faster than Linear Search O(n) for large arrays!
        </p>
      </div>
    </div>
  );
}