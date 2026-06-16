import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Text,
} from "recharts";

interface CreditScoreGaugeProps {
  score: number;
  height?: number;
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
  height = 320,
}) => {
  const rating = getRating(score);
  
  // Adjusted cx and cy to center the chart in the component viewport accurately
  const cx = 130;
  const cy = 110;
  const innerRadius = 58;
  const outerRadius = 78;

  return (
    <div className="w-full flex justify-center " style={{ height }}>
      <ResponsiveContainer className="mx-auto w-full flex justify-center-safe px-16" width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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

          {/* Arc labels */}
          {LABEL_CONFIG.map(({ text, angle }) => (
            <ArcLabel
              key={text}
              text={text}
              angle={angle}
              radius={outerRadius + 16}
              cx={cx}
              cy={cy}
            />
          ))}

          {/* Min / Max labels */}
          <Text
            x={cx - outerRadius - 12}
            y={cy + 14}
            fontSize={10}
            fontWeight={700}
            fill="#9ca3af"
            textAnchor="middle"
          >
            {MIN_SCORE}
          </Text>
          <Text
            x={cx + outerRadius + 12}
            y={cy + 14}
            fontSize={10}
            fontWeight={700}
            fill="#9ca3af"
            textAnchor="middle"
          >
            {MAX_SCORE}
          </Text>

          {/* Score text rendered natively below the needle pivot line */}
          <Text
            x={cx}
            y={cy + 36}
            textAnchor="middle"
            fontSize={32}
            fontWeight={900}
            fill="#111827"
          >
            {score}
          </Text>

          {/* Rating Badge text rendered natively underneath the score */}
          <Text
            x={cx}
            y={cy + 58}
            textAnchor="middle"
            fontSize={14}
            fontWeight={700}
            fill={rating.color}
          >
            {rating.label}
          </Text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CreditScoreGauge;