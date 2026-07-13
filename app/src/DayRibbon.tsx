import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "./theme";
import { TASKS, getState } from "./store";

// The Day Ribbon: the whole day as a strip of task dots, shared by both
// modes. Green = done, red = missed, pulsing blue = happening now.

type Props = { light?: boolean }; // light = rendered on a blue header

export default function DayRibbon({ light }: Props) {
  const { taskIndex, outcomes } = getState();

  return (
    <View style={styles.row}>
      {TASKS.map((t, i) => {
        const outcome = outcomes[t.id];
        const isCurrent = i === taskIndex;
        return (
          <React.Fragment key={t.id}>
            {i > 0 && (
              <View
                style={[
                  styles.link,
                  {
                    backgroundColor: light
                      ? "rgba(255,255,255,0.45)"
                      : colors.line,
                  },
                  outcomes[TASKS[i - 1].id] === "done" && {
                    backgroundColor: colors.sage,
                  },
                ]}
              />
            )}
            <Dot
              emoji={t.emoji}
              time={t.time.replace(/:\d+ /, " ")}
              state={
                outcome === "done"
                  ? "done"
                  : outcome === "missed"
                  ? "missed"
                  : isCurrent
                  ? "current"
                  : "upcoming"
              }
              light={light}
            />
          </React.Fragment>
        );
      })}
    </View>
  );
}

type DotState = "done" | "missed" | "current" | "upcoming";

function Dot({
  emoji,
  time,
  state,
  light,
}: {
  emoji: string;
  time: string;
  state: DotState;
  light?: boolean;
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state !== "current") return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [state, pulse]);

  const ring =
    state === "done"
      ? { backgroundColor: colors.sage, borderColor: colors.sage }
      : state === "missed"
      ? { backgroundColor: colors.ember, borderColor: colors.ember }
      : state === "current"
      ? { backgroundColor: colors.sky, borderColor: light ? "#FFFFFF" : colors.sky }
      : {
          backgroundColor: light ? "rgba(255,255,255,0.25)" : colors.cloud,
          borderColor: light ? "rgba(255,255,255,0.5)" : colors.line,
        };

  return (
    <View style={styles.dotCol}>
      <Animated.View
        style={[styles.dot, ring, state === "current" && { transform: [{ scale: pulse }] }]}
      >
        <Text style={styles.dotEmoji}>{state === "done" ? "✓" : emoji}</Text>
      </Animated.View>
      <Text
        style={[
          styles.dotTime,
          { color: light ? "rgba(255,255,255,0.9)" : colors.soft },
        ]}
      >
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "center" },
  link: { flex: 1, height: 3, borderRadius: 2, marginTop: 21, marginHorizontal: -2 },
  dotCol: { alignItems: "center", width: 62 },
  dot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dotEmoji: { fontSize: 18, color: "#fff" },
  dotTime: { fontFamily: fonts.semibold, fontSize: 12, marginTop: 4 },
});
