"use client";
import { motion } from "framer-motion";
import { MeetingItem } from "./JourneyTimeline";

interface Props {
  meetings: MeetingItem[];
}

export default function AbstractMap({ meetings }: Props) {
  // Sort ascending by date
  const sorted = [...meetings].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  // Generate constellation layout coordinates based on index
  const baseCoords = [
    { cx: 20, cy: 80 },
    { cx: 45, cy: 55 },
    { cx: 35, cy: 30 },
    { cx: 65, cy: 40 },
    { cx: 80, cy: 25 },
    { cx: 55, cy: 75 },
    { cx: 75, cy: 60 },
    { cx: 85, cy: 20 },
  ];

  const nodes = sorted.map((m, idx) => {
    const coord = baseCoords[idx % baseCoords.length];
    return {
      ...coord,
      label: m.locationName,
      title: m.title,
      isUpcoming: m.status === "PLANNED",
    };
  });

  const pathData = nodes.length > 0
    ? nodes.reduce((acc, curr, i) => `${acc} ${i === 0 ? "M" : "L"} ${curr.cx} ${curr.cy}`, "")
    : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full aspect-square flex items-center justify-center relative mt-6"
    >
      <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
        {/* Animated Path */}
        {pathData && (
          <motion.path
            d={pathData}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        )}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isLast = i === nodes.length - 1;
          return (
            <g key={i}>
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={1.5}
                fill={node.isUpcoming ? "var(--color-brand)" : "var(--color-foreground)"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.25, duration: 0.5, type: "spring" }}
              />
              {/* Highlight circle on last / upcoming meeting */}
              {isLast && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={4}
                  fill="none"
                  stroke="var(--color-brand)"
                  strokeWidth="0.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.25, duration: 0.8 }}
                />
              )}
              <motion.text
                x={node.cx}
                y={node.cy - 3.5}
                fontSize="3"
                fill="var(--color-muted)"
                textAnchor="middle"
                className="font-sans uppercase tracking-widest font-medium"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.25 + 0.2, duration: 0.4 }}
              >
                #{i + 1} {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 text-center flex flex-col items-center">
        <p className="text-[11px] text-[var(--color-muted)] italic font-light">
          "A map of the distance you've crossed for each other."
        </p>
      </div>
    </motion.div>
  );
}
