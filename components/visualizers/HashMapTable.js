import { motion } from "framer-motion";

/**
 * Reusable key-value table for hash map visualization.
 * @param {Object} props
 * @param {Array<{key: string|number, value: string|number}>} props.entries - Key-value pairs to display
 * @param {string|number|null} props.highlightedKey - Key to highlight (e.g. current lookup/insert)
 * @param {'current'|'insert'|'lookup'|null} props.highlightType - current=blue, insert=green, lookup=gold
 * @param {string} [props.title] - Optional title above the table
 * @param {string} [props.keyLabel] - Label for key column (default "Key")
 * @param {string} [props.valueLabel] - Label for value column (default "Value")
 */
export default function HashMapTable({
  entries = [],
  highlightedKey = null,
  highlightType = null,
  title = "Hash Map",
  keyLabel = "Key",
  valueLabel = "Value",
}) {
  const highlightClass =
    highlightType === "current"
      ? "bg-blue-500 text-white ring-2 ring-[#FFD700]"
      : highlightType === "insert"
        ? "bg-green-500 text-white"
        : highlightType === "lookup"
          ? "bg-[#FFD700] text-gray-900 font-bold"
          : "bg-gray-700 text-gray-200";

  return (
    <div className="w-full rounded-lg overflow-hidden border-2 border-[#625EC6]/50 bg-gray-900">
      {title && (
        <div className="px-3 py-2 bg-[#16213E] text-[#FFD700] font-semibold text-sm">
          {title}
        </div>
      )}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-[#625EC6]/30 text-gray-200">
            <th className="px-3 py-2 font-semibold">{keyLabel}</th>
            <th className="px-3 py-2 font-semibold">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-3 py-4 text-gray-500 italic">
                (empty)
              </td>
            </tr>
          ) : (
            entries.map(({ key: k, value: v }, i) => {
              const isHighlighted = highlightedKey !== null && String(k) === String(highlightedKey);
              return (
                <motion.tr
                  key={`${k}-${v}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    isHighlighted
                      ? highlightClass
                      : "bg-gray-800 text-gray-200 border-t border-gray-700"
                  }
                >
                  <td className="px-3 py-2 font-mono">{k}</td>
                  <td className="px-3 py-2 font-mono">{v}</td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
