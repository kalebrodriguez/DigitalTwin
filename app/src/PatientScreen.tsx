import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, buttonHeight, space, type } from "./theme";
import {
  PATIENT_NAME,
  confirmTask,
  currentTask,
  missTask,
  subscribe,
} from "./store";

// Patient mode: one task at a time, huge text, max three actions on screen,
// no scrolling. A short "well done" interstitial plays between tasks.

type Props = { onExit: () => void };

export default function PatientScreen({ onExit }: Props) {
  const [, force] = useState(0);
  const [interstitial, setInterstitial] = useState<string | null>(null);

  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const task = currentTask();

  const handleConfirm = () => {
    confirmTask();
    setInterstitial("Wonderful. Your family knows you're doing great.");
    setTimeout(() => setInterstitial(null), 1800);
  };

  const handleLater = () => {
    missTask();
    setInterstitial("That's okay, Margaret. I'll let Sarah know so she can help.");
    setTimeout(() => setInterstitial(null), 1800);
  };

  return (
    <View style={styles.screen}>
      <Pressable onPress={onExit} style={styles.exit} hitSlop={16}>
        <Text style={styles.exitText}>‹ Exit</Text>
      </Pressable>

      <Text style={styles.date}>Monday, July 13</Text>
      <Text style={styles.greeting}>Good morning, {PATIENT_NAME} ☀️</Text>

      {interstitial ? (
        <View style={styles.card}>
          <Text style={styles.emoji}>🌼</Text>
          <Text style={styles.taskTitle}>All done!</Text>
          <Text style={styles.taskSub}>{interstitial}</Text>
        </View>
      ) : task ? (
        <>
          <View style={styles.card}>
            <Text style={styles.emoji}>{task.emoji}</Text>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskSub}>{task.sub}</Text>
            <Text style={styles.voiceHint}>🔊 {task.voiceHint}</Text>
          </View>
          <Pressable style={styles.bigButton} onPress={handleConfirm}>
            <Text style={styles.bigButtonText}>✓  I did it</Text>
          </Pressable>
          <Pressable style={styles.laterButton} onPress={handleLater}>
            <Text style={styles.laterText}>Remind me later</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emoji}>🌙</Text>
          <Text style={styles.taskTitle}>That's everything for today</Text>
          <Text style={styles.taskSub}>
            Rest well, {PATIENT_NAME}. Your family got your daily summary.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: space.sm,
    paddingTop: 72,
    paddingBottom: space.lg,
  },
  exit: { position: "absolute", top: 56, left: space.sm },
  exitText: { fontSize: type.body, color: colors.soft },
  date: { fontSize: type.body, color: colors.soft, textAlign: "center" },
  greeting: {
    fontSize: type.title,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius,
    marginVertical: space.sm,
    padding: space.md,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 72 },
  taskTitle: {
    fontSize: type.heading,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "center",
    marginTop: space.sm,
  },
  taskSub: {
    fontSize: type.body,
    color: colors.soft,
    textAlign: "center",
    marginTop: space.xs,
    lineHeight: 26,
  },
  voiceHint: {
    fontSize: type.body,
    color: colors.primaryDark,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: space.sm,
  },
  bigButton: {
    height: buttonHeight,
    borderRadius: radius,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  bigButtonText: { fontSize: type.title, fontWeight: "800", color: "#fff" },
  laterButton: {
    height: buttonHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  laterText: {
    fontSize: type.body,
    color: colors.soft,
    textDecorationLine: "underline",
  },
});
