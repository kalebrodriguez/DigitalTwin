import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, radius, buttonHeight, space, type, shadow } from "./theme";
import DayRibbon from "./DayRibbon";
import Waveform from "./Waveform";
import {
  PATIENT_NAME,
  TASKS,
  confirmTask,
  currentTask,
  getState,
  missTask,
  subscribe,
} from "./store";

// Patient mode: one task at a time, huge calm type, no scrolling,
// never more than two actions on screen.

type Props = { onExit: () => void };

const HALO_TINTS: Record<string, string> = {
  meds: "#EAF1FF",
  dog: "#FBF3E4",
  lunch: "#EFF8EC",
  call: "#F6EFFB",
};

export default function PatientScreen({ onExit }: Props) {
  const [, force] = useState(0);
  const [interstitial, setInterstitial] = useState<string | null>(null);
  const cardAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const task = currentTask();
  const { taskIndex } = getState();

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
    <LinearGradient
      colors={["#DCEBFF", "#F7FAFF", "#FFFFFF"]}
      locations={[0, 0.45, 1]}
      style={styles.screen}
    >
      <View style={styles.topBar}>
        <Pressable onPress={onExit} hitSlop={16} style={styles.exitRow}>
          <Ionicons name="chevron-back" size={22} color={colors.soft} />
          <Text style={styles.exitText}>Exit</Text>
        </Pressable>
        {task && (
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>
              Task {Math.min(taskIndex + 1, TASKS.length)} of {TASKS.length}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.greeting}>Good morning,{"\n"}{PATIENT_NAME}</Text>
      <Text style={styles.date}>Monday, July 13</Text>

      <View style={styles.ribbonWrap}>
        <DayRibbon />
      </View>

      <Animated.View style={[styles.card, shadow.card, animatedCard]}>
        {interstitial ? (
          <View style={styles.cardInner}>
            <View style={[styles.emojiHalo, { backgroundColor: colors.sageTint }]}>
              <Text style={styles.emoji}>🌼</Text>
            </View>
            <Text style={styles.taskTitle}>All done!</Text>
            <Text style={styles.taskSub}>{interstitial}</Text>
          </View>
        ) : task ? (
          <>
            <View style={styles.cardInner}>
              <View
                style={[
                  styles.emojiHalo,
                  { backgroundColor: HALO_TINTS[task.id] ?? colors.mist },
                ]}
              >
                <Text style={styles.emoji}>{task.emoji}</Text>
              </View>
              <View style={styles.timeChip}>
                <Ionicons name="time-outline" size={15} color={colors.deep} />
                <Text style={styles.timeChipText}>Scheduled · {task.time}</Text>
              </View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskSub}>{task.sub}</Text>
            </View>
            <View style={styles.voiceBar}>
              <Waveform color={colors.sky} />
              <Text style={styles.voiceHint} numberOfLines={2}>
                {task.voiceHint}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.cardInner}>
            <View style={[styles.emojiHalo, { backgroundColor: colors.mist }]}>
              <Text style={styles.emoji}>🌙</Text>
            </View>
            <Text style={styles.taskTitle}>That's everything for today</Text>
            <Text style={styles.taskSub}>
              Rest well, {PATIENT_NAME}. Your family got your daily summary.
            </Text>
          </View>
        )}
      </Animated.View>

      {task && !interstitial ? (
        <>
          <SpringButton
            label="I did it"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              swapCard("Wonderful. Your family knows you're doing great.", confirmTask);
            }}
          />
          <Pressable
            style={({ pressed }) => [
              styles.laterButton,
              pressed && { backgroundColor: colors.mist },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              swapCard("That's okay. I'll let Sarah know so she can help.", missTask);
            }}
          >
            <Ionicons name="alarm-outline" size={22} color={colors.deep} />
            <Text style={styles.laterText}>Remind me later</Text>
          </Pressable>
        </>
      ) : (
        <View style={{ height: buttonHeight * 2 + space.sm }} />
      )}
    </LinearGradient>
  );
}

function SpringButton({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      onPressIn={() => {
        setPressed(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
      }}
      onPressOut={() => {
        setPressed(false);
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.bigButton,
          shadow.button,
          pressed && { backgroundColor: colors.sagePressed },
          { transform: [{ scale }] },
        ]}
      >
        <Ionicons name="checkmark-circle" size={28} color="#fff" />
        <Text style={styles.bigButtonText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: space.sm,
    paddingTop: 60,
    paddingBottom: space.md,
  },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  exitRow: { flexDirection: "row", alignItems: "center" },
  exitText: { fontFamily: fonts.semibold, fontSize: type.body, color: colors.soft },
  progressPill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  progressText: { fontFamily: fonts.bold, fontSize: 14, color: colors.deep },
  greeting: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 48,
    color: colors.deep,
    textAlign: "center",
    marginTop: space.sm,
  },
  date: {
    fontFamily: fonts.semibold,
    fontSize: type.caption,
    color: colors.soft,
    textAlign: "center",
    marginTop: 4,
  },
  ribbonWrap: { marginTop: space.md, marginBottom: space.xs },
  card: {
    flex: 1,
    backgroundColor: colors.cloud,
    borderRadius: radius + 8,
    marginVertical: space.sm,
    overflow: "hidden",
  },
  cardInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: space.md,
  },
  emojiHalo: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 62 },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.mist,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: space.sm,
  },
  timeChipText: { fontFamily: fonts.bold, fontSize: 13, color: colors.deep },
  taskTitle: {
    fontFamily: fonts.display,
    fontSize: type.heading,
    lineHeight: 40,
    color: colors.ink,
    textAlign: "center",
    marginTop: space.xs,
  },
  taskSub: {
    fontFamily: fonts.body,
    fontSize: type.body,
    color: colors.soft,
    textAlign: "center",
    marginTop: space.xs,
    lineHeight: 27,
  },
  voiceBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.mist,
    paddingVertical: 14,
    paddingHorizontal: space.sm,
  },
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
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  bigButtonText: { fontFamily: fonts.bold, fontSize: type.title, color: "#fff" },
  laterButton: {
    height: 56,
    borderRadius: radius,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: space.xs,
  },
  laterText: { fontFamily: fonts.bold, fontSize: type.body, color: colors.deep },
});
