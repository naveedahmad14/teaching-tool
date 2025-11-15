import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [speed, setSpeed] = useState(500);

  // Initialize array with random values
  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => 
      Math.floor(Math.random() * 90) + 10
    );
    setArray(newArray);
    setSorted(false);
    setSortedIndices([]);
    setComparing([]);
    setSwapping([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    setSorting(true);
    setSorted(false);
    const arr = [...array];
    const n = arr.length;
    const newSortedIndices = [];

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          await sleep(speed);
          
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          
          await sleep(speed);
          setSwapping([]);
        }
        
        setComparing([]);
      }
      newSortedIndices.push(n - i - 1);
      setSortedIndices([...newSortedIndices]);
    }
    
    newSortedIndices.push(0);
    setSortedIndices([...newSortedIndices]);
    setSorted(true);
    setSorting(false);
  };

  const handleStart = () => {
    if (!sorting && !sorted) {
      bubbleSort();
    }
  };

  const handleReset = () => {
    setSorting(false);
    generateArray();
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-899 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Bubble Sort Visualiser</h2>
      
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-100">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-100">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-100">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-100">Sorted</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={handleStart}
          disabled={sorting || sorted}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {sorting ? 'Sorting...' : sorted ? 'Completed' : 'Start Sort'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
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
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">How Bubble Sort Works:</h3>
        <p className="text-blue-800 text-sm">
          Bubble Sort repeatedly compares adjacent elements and swaps them if they're in the wrong order. 
          The largest elements "bubble up" to the end with each pass through the array. 
          Time complexity: O(n²)
        </p>
      </div>
    </div>
  );
}