import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, buttonHeight, space, type, shadow } from "./theme";
import DayRibbon from "./DayRibbon";
import {
  PATIENT_NAME,
  confirmTask,
  currentTask,
  missTask,
  subscribe,
} from "./store";

// Patient mode: one task at a time, huge calm type, no scrolling,
// never more than two actions on screen.

type Props = { onExit: () => void };

export default function PatientScreen({ onExit }: Props) {
  const [, force] = useState(0);
  const [interstitial, setInterstitial] = useState<string | null>(null);
  const cardAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const task = currentTask();

  const swapCard = (message: string, action: () => void) => {
    Animated.timing(cardAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(
      () => {
        action();
        setInterstitial(message);
        Animated.timing(cardAnim, { toValue: 1, duration: 260, useNativeDriver: true }).start();
        setTimeout(() => {
          Animated.timing(cardAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(
            () => {
              setInterstitial(null);
              Animated.timing(cardAnim, {
                toValue: 1,
                duration: 260,
                useNativeDriver: true,
              }).start();
            }
          );
        }, 1900);
      }
    );
  };

  const animatedCard = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }),
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={16}>
          <Text style={styles.exitText}>‹ Exit</Text>
        </Pressable>
        <Text style={styles.date}>Monday, July 13</Text>
        <View style={{ width: 48 }} />
      </View>

      <Text style={styles.greeting}>Good morning,{"\n"}{PATIENT_NAME} ☀️</Text>

      <View style={styles.ribbonWrap}>
        <DayRibbon />
      </View>

      <Animated.View style={[styles.card, shadow.card, animatedCard]}>
        {interstitial ? (
          <>
            <View style={[styles.emojiHalo, { backgroundColor: colors.sageTint }]}>
              <Text style={styles.emoji}>🌼</Text>
            </View>
            <Text style={styles.taskTitle}>All done!</Text>
            <Text style={styles.taskSub}>{interstitial}</Text>
          </>
        ) : task ? (
          <>
            <View style={styles.emojiHalo}>
              <Text style={styles.emoji}>{task.emoji}</Text>
            </View>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskSub}>{task.sub}</Text>
            <View style={styles.voiceRow}>
              <Text style={styles.voiceIcon}>🔊</Text>
              <Text style={styles.voiceHint}>{task.voiceHint}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.emojiHalo, { backgroundColor: colors.mist }]}>
              <Text style={styles.emoji}>🌙</Text>
            </View>
            <Text style={styles.taskTitle}>That's everything for today</Text>
            <Text style={styles.taskSub}>
              Rest well, {PATIENT_NAME}. Your family got your daily summary.
            </Text>
          </>
        )}
      </Animated.View>

      {task && !interstitial ? (
        <>
          <SpringButton
            label="✓   I did it"
            onPress={() =>
              swapCard("Wonderful. Your family knows you're doing great.", confirmTask)
            }
          />
          <Pressable
            style={styles.laterButton}
            onPress={() =>
              swapCard("That's okay. I'll let Sarah know so she can help.", missTask)
            }
          >
            <Text style={styles.laterText}>Remind me later</Text>
          </Pressable>
        </>
      ) : (
        <View style={{ height: buttonHeight + 56 }} />
      )}
    </View>
  );
}

function SpringButton({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
      }
      onPress={onPress}
    >
      <Animated.View style={[styles.bigButton, shadow.button, { transform: [{ scale }] }]}>
        <Text style={styles.bigButtonText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.mist,
    paddingHorizontal: space.sm,
    paddingTop: 60,
    paddingBottom: space.md,
  },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  exitText: { fontFamily: fonts.semibold, fontSize: type.body, color: colors.soft },
  date: { fontFamily: fonts.semibold, fontSize: type.caption, color: colors.soft },
  greeting: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 46,
    color: colors.deep,
    textAlign: "center",
    marginTop: space.sm,
  },
  ribbonWrap: { marginTop: space.md, marginBottom: space.xs },
  card: {
    flex: 1,
    backgroundColor: colors.cloud,
    borderRadius: radius + 4,
    marginVertical: space.sm,
    padding: space.md,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiHalo: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 60 },
  taskTitle: {
    fontFamily: fonts.display,
    fontSize: type.heading,
    lineHeight: 40,
    color: colors.ink,
    textAlign: "center",
    marginTop: space.sm,
  },
  taskSub: {
    fontFamily: fonts.body,
    fontSize: type.body,
    color: colors.soft,
    textAlign: "center",
    marginTop: space.xs,
    lineHeight: 27,
  },
  voiceRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mist,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: space.sm,
  },
  voiceIcon: { fontSize: 18, marginRight: 8 },
  voiceHint: {
    flex: 1,
    fontFamily: fonts.body,
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 22,
    color: colors.deep,
  },
  bigButton: {
    height: buttonHeight,
    borderRadius: radius,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  bigButtonText: { fontFamily: fonts.bold, fontSize: type.title, color: "#fff" },
  laterButton: { height: 52, alignItems: "center", justifyContent: "center", marginTop: 4 },
  laterText: {
    fontFamily: fonts.semibold,
    fontSize: type.body,
    color: colors.soft,
    textDecorationLine: "underline",
  },
});
