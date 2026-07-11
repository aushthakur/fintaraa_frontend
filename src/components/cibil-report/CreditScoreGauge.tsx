import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Text,
} from "recharts";

interface CreditScoreGaugeProps {
  score: number;
  width?: number;
  height?: number;
  scale?: number;
  className?: string;
}

const GAUGE_DATA = [
  { value: 25, color: "#ef4444", label: "POOR" },
  { value: 25, color: "#f59e0b", label: "FAIR" },
  { value: 25, color: "#3b82f6", label: "GOOD" },
  { value: 25, color: "#10b981", label: "EXCELLENT" },
];

const MIN_SCORE = 300;
const MAX_SCORE = 900;
const RADIAN = Math.PI / 180;

const getRating = (score: number) => {
  if (!score) return { label: "Not fetched", color: "#667085" };
  if (score < 580) return { label: "Poor", color: "#ef4444" };
  if (score < 670) return { label: "Fair", color: "#f59e0b" };
  if (score < 740) return { label: "Good", color: "#3b82f6" };
  return { label: "Excellent", color: "#10b981" };
};

const LABEL_CONFIG = [
  { text: "POOR", angle: 157.5 },
  { text: "FAIR", angle: 112.5 },
  { text: "GOOD", angle: 67.5 },
  { text: "EXCELLENT", angle: 22.5 },
];

const ArcLabel = ({
  text,
  angle,
  radius,
  cx,
  cy,
}: {
  text: string;
  angle: number;
  radius: number;
  cx: number;
  cy: number;
}) => {
  const x = cx + radius * Math.cos(-angle * RADIAN);
  const y = cy + radius * Math.sin(-angle * RADIAN);
  const rotation = -angle + 90;
  return (
    <Text
      x={x}
      y={y}
      textAnchor="middle"
      verticalAnchor="middle"
      fontSize={8}
      fontWeight={900}
      fill="#4b5563"
      transform={`rotate(${rotation} ${x} ${y})`}
    >
      {text}
    </Text>
  );
};

const renderNeedle = (
  score: number,
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number
) => {
  const value = Math.min(MAX_SCORE, Math.max(MIN_SCORE, score));
  const angle = 180 - ((value - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 180;

  const tipRadius = outerRadius - 4;
  const tipX = cx + tipRadius * Math.cos(-angle * RADIAN);
  const tipY = cy + tipRadius * Math.sin(-angle * RADIAN);

  const baseOffset = 6;
  const leftX = cx + baseOffset * Math.cos((-angle - 90) * RADIAN);
  const leftY = cy + baseOffset * Math.sin((-angle - 90) * RADIAN);
  const rightX = cx + baseOffset * Math.cos((-angle + 90) * RADIAN);
  const rightY = cy + baseOffset * Math.sin((-angle + 90) * RADIAN);

  return (
    <g>
      <path
        d={`M${leftX} ${leftY} L${rightX} ${rightY} L${tipX} ${tipY} Z`}
        fill="#1e293b"
      />
      <circle cx={cx} cy={cy} r={5} fill="#1e293b" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  score,
  scale = 1,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth;
      setContainerWidth(w);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [updateWidth]);

  if (containerWidth === 0) return <div ref={containerRef} className="w-full" style={{ aspectRatio: "560/350" }} />;

  const chartWidth = containerWidth;
  const chartHeight = chartWidth * (350 / 560);

  const rating = getRating(score);
  const cx = chartWidth / 2;
  const cy = chartHeight * 0.52;
  const outerRadius = Math.min(chartWidth * 0.28, chartHeight * 0.34) * scale;
  const innerRadius = outerRadius * 0.74;
  const labelRadius = outerRadius + Math.max(14, chartHeight * 0.06) * Math.min(scale, 1.5);
  const minMaxOffset = Math.max(12, chartHeight * 0.03) * Math.min(scale, 1.5);
  const scoreY = cy + Math.max(34, chartHeight * 0.16) * Math.min(scale, 1.5);
  const ratingY = cy + Math.max(58, chartHeight * 0.27) * Math.min(scale, 1.5);

  const scoreFontSize = Math.max(24, Math.round(chartHeight * 0.13 * Math.min(scale, 1.5)));
  const ratingFontSize = Math.max(12, Math.round(chartHeight * 0.055 * Math.min(scale, 1.5)));

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <PieChart width={chartWidth} height={chartHeight}>
        <Pie
          data={GAUGE_DATA}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          stroke="#fff"
          strokeWidth={2}
        >
          {GAUGE_DATA.map((item, index) => (
            <Cell key={index} fill={item.color} />
          ))}
        </Pie>

        {renderNeedle(score, cx, cy, innerRadius, outerRadius)}

        {LABEL_CONFIG.map(({ text, angle }) => (
          <ArcLabel
            key={text}
            text={text}
            angle={angle}
            radius={labelRadius}
            cx={cx}
            cy={cy}
          />
        ))}

        <Text
          x={cx - outerRadius - minMaxOffset}
          y={cy + Math.max(12, chartHeight * 0.03)}
          fontSize={Math.max(8, Math.round(10 * Math.min(scale, 1.5)))}
          fontWeight={700}
          fill="#9ca3af"
          textAnchor="middle"
        >
          {MIN_SCORE}
        </Text>
        <Text
          x={cx + outerRadius + minMaxOffset}
          y={cy + Math.max(12, chartHeight * 0.03)}
          fontSize={Math.max(8, Math.round(10 * Math.min(scale, 1.5)))}
          fontWeight={700}
          fill="#9ca3af"
          textAnchor="middle"
        >
          {MAX_SCORE}
        </Text>

        <Text
          x={cx}
          y={scoreY}
          textAnchor="middle"
          fontSize={scoreFontSize}
          fontWeight={900}
          fill="#111827"
        >
          {score > 0 ? score : "—"}
        </Text>

        <Text
          x={cx}
          y={ratingY}
          textAnchor="middle"
          fontSize={ratingFontSize}
          fontWeight={700}
          fill={rating.color}
        >
          {rating.label}
        </Text>
      </PieChart>
    </div>
  );
};

export default CreditScoreGauge;
