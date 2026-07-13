import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, space, type } from "./theme";
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

// Caregiver mode: live status, digital twin scores, and the day's timeline.

type Props = { onExit: () => void };

export default function CaregiverScreen({ onExit }: Props) {
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const { status, feed } = getState();
  const ok = status === "ok";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onExit} hitSlop={16}>
          <Text style={styles.exitText}>‹ Exit</Text>
        </Pressable>
        <Text style={styles.appName}>DIGITALTWIN</Text>
        <Text style={styles.title}>{PATIENT_NAME}'s Day</Text>
        <View style={[styles.pill, ok ? styles.pillOk : styles.pillAlert]}>
          <View style={[styles.dot, ok ? styles.dotOk : styles.dotAlert]} />
          <Text style={styles.pillText}>
            {ok ? "Everything on track" : "Needs attention"}
          </Text>
        </View>
        <View style={styles.scores}>
          <ScoreCard label="Tasks done" value={`${completedCount()}/${TASKS.length}`} />
          <ScoreCard label="Adherence" value={`${adherencePct()}%`} />
        </View>
      </View>

      <FlatList
        data={feed}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.feed}
        ListHeaderComponent={<Text style={styles.feedDay}>TODAY</Text>}
        renderItem={({ item }) => <FeedRow event={item} />}
      />
    </View>
  );
}

function ScoreCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.scoreCard}>
      <Text style={styles.scoreValue}>{value}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

function FeedRow({ event }: { event: FeedEvent }) {
  const border =
    event.kind === "good"
      ? colors.success
      : event.kind === "warn"
      ? colors.danger
      : colors.primary;
  return (
    <View
      style={[
        styles.notif,
        { borderLeftColor: border },
        event.kind === "warn" && { backgroundColor: colors.dangerTint },
      ]}
    >
      <Text style={styles.notifIcon}>{event.icon}</Text>
      <View style={styles.notifBody}>
        <Text
          style={[styles.notifTitle, event.kind === "warn" && { color: colors.danger }]}
        >
          {event.title}
        </Text>
        <Text style={styles.notifText}>{event.text}</Text>
        {event.needsAction && (
          <Pressable style={styles.actionBtn} onPress={() => resolveAlert(event.id)}>
            <Text style={styles.actionText}>📞  Call Mom now</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.notifTime}>{event.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingHorizontal: space.sm,
    paddingBottom: space.sm,
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
  },
  exitText: { fontSize: type.body, color: "#fff", marginBottom: 4 },
  appName: { fontSize: 15, color: "#EAF3FF", letterSpacing: 2, fontWeight: "600" },
  title: { fontSize: type.title, fontWeight: "800", color: "#fff", marginTop: 2 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: space.xs,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  pillOk: { backgroundColor: "rgba(255,255,255,0.25)" },
  pillAlert: { backgroundColor: colors.danger },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 7 },
  dotOk: { backgroundColor: "#7BE29B" },
  dotAlert: { backgroundColor: "#fff" },
  pillText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  scores: { flexDirection: "row", gap: space.xs, marginTop: space.sm },
  scoreCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: radius - 8,
    padding: space.sm,
    alignItems: "center",
  },
  scoreValue: { fontSize: type.title, fontWeight: "800", color: "#fff" },
  scoreLabel: { fontSize: 15, color: "#EAF3FF", marginTop: 2 },
  feed: { padding: space.sm },
  feedDay: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.soft,
    letterSpacing: 1,
    marginBottom: space.xs,
  },
  notif: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius - 8,
    borderLeftWidth: 4,
    padding: space.sm,
    marginBottom: space.xs,
    alignItems: "flex-start",
  },
  notifIcon: { fontSize: 22, marginRight: 10 },
  notifBody: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
  notifText: { fontSize: 15, color: colors.soft, marginTop: 2, lineHeight: 21 },
  notifTime: { fontSize: 14, color: colors.soft, marginLeft: 8 },
  actionBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: space.xs,
  },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
