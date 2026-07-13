import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "./theme";

// The companion's voice, visible: five bars breathing in a staggered wave
// while the assistant "speaks" the reminder.

export default function Waveform({ color = colors.sky }: { color?: string }) {
  const bars = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0.4))
  ).current;

  useEffect(() => {
    const loops = bars.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 120),
          Animated.timing(v, { toValue: 1, duration: 380, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.35, duration: 420, useNativeDriver: true }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [bars]);

  return (
    <View style={styles.row}>
      {bars.map((v, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: color, transform: [{ scaleY: v }] },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 28,
  },
  bar: { width: 5, height: 26, borderRadius: 3 },
});
