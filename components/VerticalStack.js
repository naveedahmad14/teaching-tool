import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable vertical stack visualization (bottom to top).
 * @param {Object} props
 * @param {Array<{value: string|number, index?: number}>} props.items - Stack items; items[0] = bottom
 * @param {boolean} [props.highlightTop] - Highlight the top (last) item
 * @param {number|null} [props.highlightPopped] - Index in items to show as "popped" (red)
 * @param {string} [props.emptyLabel] - Label when stack is empty
 */
export default function VerticalStack({
  items = [],
  highlightTop = false,
  highlightPopped = null,
  emptyLabel = "empty",
}) {
  return (
    <div className="flex flex-col-reverse items-center min-h-[120px] w-20 rounded-lg bg-gray-800/50 border-2 border-[#625EC6]/40 p-2">
      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 text-xs py-4"
          >
            {emptyLabel}
          </motion.div>
        ) : (
          items.map((item, i) => {
            const isTop = i === items.length - 1;
            const isPopped = highlightPopped === i;
            const className = isPopped
              ? "bg-red-500 text-white ring-2 ring-red-700"
              : isTop && highlightTop
                ? "bg-blue-500 text-white ring-2 ring-[#FFD700]"
                : "bg-blue-500/90 text-white";
            return (
              <motion.div
                key={`${item.value}-${item.index ?? i}-${i}`}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className={`w-14 h-10 rounded flex items-center justify-center font-bold text-sm shadow ${className}`}
              >
                {item.value}
                {item.index !== undefined && (
                  <span className="text-xs opacity-80 ml-0.5">({item.index})</span>
                )}
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
