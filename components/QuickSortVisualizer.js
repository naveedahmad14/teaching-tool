import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function QuickSortVisualizer() {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [comparing, setComparing] = useState([]);
  const [pivot, setPivot] = useState(null);
  const [partitioning, setPartitioning] = useState([]);
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
    setPivot(null);
    setPartitioning([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const quickSort = async () => {
    setSorting(true);
    setSorted(false);
    const arr = [...array];
    const newSortedIndices = [];

    const partition = async (low, high) => {
      const pivotValue = arr[high];
      setPivot(high);
      setPartitioning([low, high]);
      await sleep(speed);

      let i = low - 1;

      for (let j = low; j < high; j++) {
        setComparing([j, high]);
        await sleep(speed);

        if (arr[j] < pivotValue) {
          i++;
          if (i !== j) {
            // Swap
            [arr[i], arr[j]] = [arr[j], arr[i]];
            setArray([...arr]);
            await sleep(speed);
          }
        }
        setComparing([]);
      }

      // Place pivot in correct position
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(speed);

      newSortedIndices.push(i + 1);
      setSortedIndices([...newSortedIndices]);
      setPivot(null);
      setPartitioning([]);

      return i + 1;
    };

    const sort = async (low, high) => {
      if (low < high) {
        const pi = await partition(low, high);
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      } else if (low === high) {
        newSortedIndices.push(low);
        setSortedIndices([...newSortedIndices]);
      }
    };

    await sort(0, arr.length - 1);
    
    // Mark all as sorted
    setSortedIndices(Array.from({ length: arr.length }, (_, i) => i));
    setSorted(true);
    setSorting(false);
  };

  const handleStart = () => {
    if (!sorting && !sorted) {
      quickSort();
    }
  };

  const handleReset = () => {
    setSorting(false);
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
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Sort Visualiser</h2>
      
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
                  scale: pivot === index ? 1.15 : comparing.includes(index) ? 1.1 : 1,
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
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span className="text-gray-700">Partition Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-gray-700">Pivot</span>
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
          disabled={sorting || sorted}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {sorting ? 'Sorting...' : sorted ? 'Completed' : 'Start Sort'}
        </button>
        
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
        <h3 className="font-semibold text-blue-900 mb-2">How Quick Sort Works:</h3>
        <p className="text-blue-800 text-sm">
          Quick Sort selects a pivot element and partitions the array so all elements smaller than the pivot 
          are on the left and larger elements are on the right. It then recursively sorts the sub-arrays. 
          Time complexity: O(n log n) average, O(n²) worst case.
        </p>
      </div>
    </div>
  );
}