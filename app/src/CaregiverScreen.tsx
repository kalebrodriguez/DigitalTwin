import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, radius, space, type, shadow } from "./theme";
import DayRibbon from "./DayRibbon";
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

export default function CaregiverScreen({ onExit }: Props) {
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const { status, feed } = getState();
  const ok = status === "ok";

  return (
    <View style={styles.screen}>
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

        <View style={styles.patientRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{PATIENT_NAME}'s Day</Text>
            <View style={styles.subtitleRow}>
              <Ionicons name="home" size={12} color="rgba(255,255,255,0.9)" />
              <Text style={styles.subtitle}>At home · Tampa, FL</Text>
            </View>
          </View>
          <View style={styles.batteryCol}>
            <BatteryGlyph level={82} />
            <Text style={styles.batteryText}>82%</Text>
          </View>
        </View>

        <View style={[styles.statusCard, !ok && styles.statusCardAlert]}>
          <Text style={styles.statusIcon}>{ok ? "💙" : "⚠️"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, !ok && { color: "#fff" }]}>
              {ok ? "Mom is okay" : "Mom needs a check-in"}
            </Text>
            <Text style={[styles.statusSub, !ok && { color: "rgba(255,255,255,0.9)" }]}>
              {ok
                ? "Everything on track so far today."
                : "A task was missed — see below."}
            </Text>
          </View>
          <View style={styles.statusStats}>
            <Text style={[styles.statusStatNum, !ok && { color: "#fff" }]}>
              {completedCount()}/{TASKS.length}
            </Text>
            <Text style={[styles.statusStatLabel, !ok && { color: "rgba(255,255,255,0.9)" }]}>
              tasks · {adherencePct()}%
            </Text>
          </View>
        </View>

        <View style={styles.ribbonWrap}>
          <DayRibbon light />
        </View>
      </LinearGradient>

      <FlatList
        data={feed}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.feed}
        ListHeaderComponent={<Text style={styles.feedDay}>Today's timeline</Text>}
        renderItem={({ item, index }) => (
          <FeedRow event={item} isLast={index === feed.length - 1} />
        )}
      />
    </View>
  );
}

// Battery as a safety signal (pattern borrowed from Life360's member rows):
// caregivers need to know Mom's device is alive, not just her tasks.
function BatteryGlyph({ level }: { level: number }) {
  const color = level <= 20 ? colors.ember : "#fff";
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
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
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { fontFamily: fonts.display, fontSize: 26, color: "#fff" },
  title: { fontFamily: fonts.display, fontSize: 28, color: "#fff" },
  subtitleRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
  subtitle: {
    fontFamily: fonts.semibold,
    fontSize: type.caption,
    color: "rgba(255,255,255,0.9)",
  },
  batteryCol: { alignItems: "center", gap: 2, marginLeft: 8 },
  batteryBody: {
    width: 24,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 3,
    padding: 1.5,
    justifyContent: "center",
  },
  batteryTip: { width: 2, height: 5, borderRadius: 1, marginLeft: 1 },
  batteryText: { fontFamily: fonts.semibold, fontSize: 12, color: "#fff" },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cloud,
    borderRadius: radius - 4,
    padding: space.sm,
    marginTop: space.sm,
  },
  statusCardAlert: { backgroundColor: colors.ember },
  statusIcon: { fontSize: 28, marginRight: 12 },
  statusTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.ink },
  statusSub: {
    fontFamily: fonts.body,
    fontSize: type.caption,
    color: colors.soft,
    marginTop: 2,
  },
  statusStats: { alignItems: "flex-end", marginLeft: 8 },
  statusStatNum: { fontFamily: fonts.bold, fontSize: 22, color: colors.deep },
  statusStatLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.soft },
  ribbonWrap: { marginTop: space.sm },
  feed: { padding: space.sm, paddingBottom: space.lg },
  feedDay: {
    fontFamily: fonts.bold,
    fontSize: type.caption,
    color: colors.soft,
    letterSpacing: 1.5,
    textTransform: "uppercase",
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
