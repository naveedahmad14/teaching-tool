import { useState } from "react";
import { motion } from "framer-motion";
import VerticalStack from "./VerticalStack";

const INITIAL = [3, 7, 1];

export default function BasicStackDemo() {
  const [stack, setStack] = useState([...INITIAL]);
  const [lastOp, setLastOp] = useState("");
  const [nextVal, setNextVal] = useState(5);

  const handlePush = () => {
    setStack((s) => [...s, nextVal]);
    setLastOp(`Push(${nextVal})`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setLastOp("Pop() — empty!");
      return;
    }
    const top = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setLastOp(`Pop() → ${top}`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setLastOp("Peek() — empty!");
      return;
    }
    setLastOp(`Peek() → ${stack[stack.length - 1]}`);
  };

  const items = stack.map((value, index) => ({ value, index }));

  return (
    <div className="w-full max-w-sm rounded-xl bg-gray-900 border-2 border-[#625EC6]/50 p-6">
      <h3 className="text-lg font-bold text-[#FFD700] mb-3">Basic Stack: Push, Pop, Peek</h3>
      <p className="text-gray-400 text-sm mb-3">LIFO: Last In, First Out</p>
      <div className="flex flex-col items-center gap-4">
        <VerticalStack items={items} highlightTop={stack.length > 0} emptyLabel="empty" />
        <p className="text-gray-500 text-xs">↑ top</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <input
            type="number"
            value={nextVal}
            onChange={(e) => setNextVal(Number(e.target.value) || 0)}
            className="w-16 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 text-sm"
          />
          <button type="button" onClick={handlePush} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">
            Push
          </button>
          <button type="button" onClick={handlePop} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
            Pop
          </button>
          <button type="button" onClick={handlePeek} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
            Peek
          </button>
        </div>
        {lastOp && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-300 text-sm font-mono">
            {lastOp}
          </motion.p>
        )}
      </div>
    </div>
  );
}
