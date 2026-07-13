import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  size: number;
  stroke: number;
  progress: number; // 0..1
  color: string;
  track: string;
  children?: React.ReactNode;
};

export default function ProgressRing({
  size,
  stroke,
  progress,
  color,
  track,
  children,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={track}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c}`}
          strokeDashoffset={c * (1 - Math.min(Math.max(progress, 0), 1))}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}
