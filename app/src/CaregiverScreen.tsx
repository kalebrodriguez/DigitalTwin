import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, radius, space, type, shadow } from "./theme";
import DayRibbon from "./DayRibbon";
import ProgressRing from "./ProgressRing";
import {
  FeedEvent,
  PATIENT_NAME,
  TASKS,
  adherencePct,
  completedCount,
  getState,
  resolveAlert,
  subscribe,
} from "./store";

// Caregiver mode: answers "Is my loved one okay?" at a glance,
// then shows the day as a timeline.

type Props = { onExit: () => void };

// Scripted week for the trend chart (Mon..Sun, today = Mon of new week)
const WEEK = [
  { d: "M", v: 1.0 },
  { d: "T", v: 0.75 },
  { d: "W", v: 1.0 },
  { d: "T", v: 1.0 },
  { d: "F", v: 0.5 },
  { d: "S", v: 1.0 },
  { d: "S", v: 0.75 },
];

export default function CaregiverScreen({ onExit }: Props) {
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const { status, feed } = getState();
  const ok = status === "ok";
  const done = completedCount();
  const progress = done / TASKS.length;

  return (
    <View style={styles.screen}>
      <FlatList
        data={feed}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.feed}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={[colors.sky, "#4E90E8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}
            >
              <View style={styles.headerTop}>
                <Pressable onPress={onExit} hitSlop={16} style={styles.exitRow}>
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                  <Text style={styles.exitText}>Exit</Text>
                </Pressable>
                <Text style={styles.appName}>DIGITALTWIN</Text>
                <View style={styles.bell}>
                  <Ionicons name="notifications" size={17} color="#fff" />
                  {!ok && <View style={styles.bellDot} />}
                </View>
              </View>

              <View style={styles.heroRow}>
                <ProgressRing
                  size={116}
                  stroke={10}
                  progress={progress}
                  color={ok ? "#FFFFFF" : "#FFD8CF"}
                  track="rgba(255,255,255,0.28)"
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>M</Text>
                  </View>
                </ProgressRing>

                <View style={styles.heroText}>
                  <Text style={styles.title}>
                    {ok ? "Mom is okay" : "Check on Mom"}
                  </Text>
                  <View style={styles.subtitleRow}>
                    <Ionicons name="home" size={12} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.subtitle}>At home · Tampa, FL</Text>
                  </View>
                  <View style={styles.heroStats}>
                    <View style={styles.heroStat}>
                      <Text style={styles.heroStatNum}>
                        {done}/{TASKS.length}
                      </Text>
                      <Text style={styles.heroStatLabel}>tasks</Text>
                    </View>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroStat}>
                      <Text style={styles.heroStatNum}>{adherencePct()}%</Text>
                      <Text style={styles.heroStatLabel}>adherence</Text>
                    </View>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroStat}>
                      <BatteryGlyph level={82} />
                      <Text style={styles.heroStatLabel}>device</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.ribbonWrap}>
                <DayRibbon light />
              </View>

              <View style={styles.quickRow}>
                <QuickAction icon="call" label="Call Mom" />
                <QuickAction icon="chatbubble" label="Message" />
                <QuickAction icon="mic" label="Talk to twin" />
                <QuickAction icon="calendar" label="Routine" />
              </View>
            </LinearGradient>

            <View style={[styles.weekCard, shadow.card]}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekTitle}>This week</Text>
                <Text style={styles.weekMeta}>86% of tasks completed</Text>
              </View>
              <View style={styles.weekBars}>
                {WEEK.map((day, i) => (
                  <View key={i} style={styles.weekCol}>
                    <View style={styles.weekTrack}>
                      <View
                        style={[
                          styles.weekFill,
                          {
                            height: `${day.v * 100}%`,
                            backgroundColor:
                              day.v >= 1 ? colors.sage : day.v >= 0.7 ? colors.sky : colors.gold,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.weekDay}>{day.d}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.feedDay}>Today's timeline</Text>
          </>
        }
        renderItem={({ item, index }) => (
          <FeedRow event={item} isLast={index === feed.length - 1} />
        )}
      />
    </View>
  );
}

function QuickAction({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]}
      onPress={() => Haptics.selectionAsync()}
    >
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

// Battery as a safety signal (pattern borrowed from Life360's member rows):
// caregivers need to know Mom's device is alive, not just her tasks.
function BatteryGlyph({ level }: { level: number }) {
  const color = level <= 20 ? colors.ember : "#fff";
  return (
    <View style={{ flexDirection: "row", alignItems: "center", height: 26 }}>
      <View style={[styles.batteryBody, { borderColor: color }]}>
        <View
          style={{
            height: "100%",
            width: `${level}%`,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
      <View style={[styles.batteryTip, { backgroundColor: color }]} />
      <Text style={styles.batteryPct}> {level}%</Text>
    </View>
  );
}

function FeedRow({ event, isLast }: { event: FeedEvent; isLast: boolean }) {
  const tone =
    event.kind === "good"
      ? { dot: colors.sage, tint: colors.cloud, title: colors.ink }
      : event.kind === "warn"
      ? { dot: colors.ember, tint: colors.emberTint, title: colors.ember }
      : { dot: colors.sky, tint: colors.cloud, title: colors.ink };

  return (
    <View style={styles.rowWrap}>
      <View style={styles.rail}>
        <View style={[styles.railDot, { backgroundColor: tone.dot }]} />
        {!isLast && <View style={styles.railLine} />}
      </View>
      <View style={[styles.notif, shadow.card, { backgroundColor: tone.tint }]}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifIcon}>{event.icon}</Text>
          <Text style={[styles.notifTitle, { color: tone.title }]} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.notifTime}>{event.time}</Text>
        </View>
        <Text style={styles.notifText}>{event.text}</Text>
        {event.needsAction && (
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { backgroundColor: colors.emberPressed },
            ]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              resolveAlert(event.id);
            }}
          >
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={styles.actionText}>Call Mom now</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.mist },
  header: {
    paddingTop: 56,
    paddingHorizontal: space.sm,
    paddingBottom: space.md,
    borderBottomLeftRadius: radius + 8,
    borderBottomRightRadius: radius + 8,
    marginHorizontal: -space.sm,
    marginTop: -space.sm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exitRow: { flexDirection: "row", alignItems: "center", width: 64 },
  exitText: { fontFamily: fonts.semibold, fontSize: type.body, color: "#fff" },
  appName: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 3,
  },
  bell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.ember,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  heroRow: { flexDirection: "row", alignItems: "center", marginTop: space.sm },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: fonts.display, fontSize: 38, color: "#fff" },
  heroText: { flex: 1, marginLeft: space.sm },
  title: { fontFamily: fonts.display, fontSize: 28, color: "#fff" },
  subtitleRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
  subtitle: {
    fontFamily: fonts.semibold,
    fontSize: type.caption,
    color: "rgba(255,255,255,0.9)",
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.xs,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  heroStat: { alignItems: "center" },
  heroStatNum: { fontFamily: fonts.bold, fontSize: 17, color: "#fff", height: 26, textAlignVertical: "center" },
  heroStatLabel: { fontFamily: fonts.semibold, fontSize: 11, color: "rgba(255,255,255,0.9)" },
  heroDivider: {
    width: 1,
    height: 26,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginHorizontal: 12,
  },
  ribbonWrap: { marginTop: space.sm },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: space.sm,
    paddingHorizontal: 4,
  },
  quick: { alignItems: "center", width: 76 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },
  weekCard: {
    backgroundColor: colors.cloud,
    borderRadius: radius - 4,
    padding: space.sm,
    marginTop: space.sm,
  },
  weekHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  weekTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink },
  weekMeta: { fontFamily: fonts.semibold, fontSize: 13, color: colors.soft },
  weekBars: { flexDirection: "row", justifyContent: "space-between", marginTop: space.sm },
  weekCol: { alignItems: "center", flex: 1 },
  weekTrack: {
    width: 14,
    height: 64,
    borderRadius: 7,
    backgroundColor: colors.mist,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  weekFill: { width: "100%", borderRadius: 7 },
  weekDay: { fontFamily: fonts.semibold, fontSize: 12, color: colors.soft, marginTop: 5 },
  batteryBody: {
    width: 24,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 3,
    padding: 1.5,
    justifyContent: "center",
  },
  batteryTip: { width: 2, height: 5, borderRadius: 1, marginLeft: 1 },
  batteryPct: { fontFamily: fonts.bold, fontSize: 13, color: "#fff" },
  feed: { padding: space.sm, paddingBottom: space.lg, paddingTop: space.sm },
  feedDay: {
    fontFamily: fonts.bold,
    fontSize: type.caption,
    color: colors.soft,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: space.md,
    marginBottom: space.xs,
    marginLeft: 30,
  },
  rowWrap: { flexDirection: "row" },
  rail: { width: 22, alignItems: "center" },
  railDot: { width: 12, height: 12, borderRadius: 6, marginTop: 22 },
  railLine: { flex: 1, width: 2, backgroundColor: colors.line, marginTop: 4 },
  notif: {
    flex: 1,
    borderRadius: radius - 6,
    padding: space.sm,
    marginBottom: space.xs,
    marginLeft: 8,
  },
  notifHeader: { flexDirection: "row", alignItems: "center" },
  notifIcon: { fontSize: 20, marginRight: 8 },
  notifTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 16 },
  notifTime: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.soft,
    marginLeft: 8,
  },
  notifText: {
    fontFamily: fonts.body,
    fontSize: type.caption,
    color: colors.soft,
    lineHeight: 21,
    marginTop: 6,
    marginLeft: 28,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: colors.ember,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginTop: 10,
    marginLeft: 28,
    ...shadow.button,
  },
  actionText: { fontFamily: fonts.bold, fontSize: type.caption, color: "#fff" },
});
