import React, { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { colors, fonts, radius, space, type, shadow } from "./src/theme";
import { resetDay } from "./src/store";
import PatientScreen from "./src/PatientScreen";
import CaregiverScreen from "./src/CaregiverScreen";

type Mode = "select" | "patient" | "caregiver";

export default function App() {
  const [mode, setMode] = useState<Mode>("select");
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.sky }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={mode === "patient" ? "dark-content" : "light-content"}
      />
      {mode === "patient" && <PatientScreen onExit={() => setMode("select")} />}
      {mode === "caregiver" && <CaregiverScreen onExit={() => setMode("select")} />}
      {mode === "select" && (
        <LinearGradient
          colors={[colors.sky, "#3D82DE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={styles.screen}
        >
          <View style={styles.brandBlock}>
            <View style={styles.logoHalo}>
              <Text style={styles.logoEmoji}>💙</Text>
            </View>
            <Text style={styles.logo}>DigitalTwin</Text>
            <Text style={styles.tagline}>
              A gentle companion for her day.{"\n"}Peace of mind for yours.
            </Text>
          </View>

          <View style={styles.cards}>
            <ModeCard
              emoji="🌼"
              title="Patient"
              sub="Margaret's guided day"
              onPress={() => setMode("patient")}
            />
            <ModeCard
              emoji="💙"
              title="Caregiver"
              sub="Sarah's live view"
              onPress={() => setMode("caregiver")}
            />
          </View>

          <Pressable onPress={resetDay} hitSlop={16}>
            <Text style={styles.reset}>Restart demo day</Text>
          </Pressable>
          <Text style={styles.footnote}>Demo prototype · scripted data</Text>
        </LinearGradient>
      )}
    </View>
  );
}

function ModeCard({
  emoji,
  title,
  sub,
  onPress,
}: {
  emoji: string;
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.modeCard, shadow.card]} onPress={onPress}>
      <Text style={styles.modeEmoji}>{emoji}</Text>
      <Text style={styles.modeTitle}>{title}</Text>
      <Text style={styles.modeSub}>{sub}</Text>
      <View style={styles.modeGo}>
        <Text style={styles.modeGoText}>Open →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: space.md,
  },
  brandBlock: { alignItems: "center", marginBottom: space.lg },
  logoHalo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  logoEmoji: { fontSize: 40 },
  logo: { fontFamily: fonts.display, fontSize: 44, color: "#fff" },
  tagline: {
    fontFamily: fonts.body,
    fontSize: type.body,
    color: "rgba(255,255,255,0.95)",
    textAlign: "center",
    marginTop: space.xs,
    lineHeight: 27,
  },
  cards: { flexDirection: "row", gap: space.sm, alignSelf: "stretch" },
  modeCard: {
    flex: 1,
    backgroundColor: colors.cloud,
    borderRadius: radius,
    padding: space.sm,
    paddingVertical: space.md,
    alignItems: "center",
  },
  modeEmoji: { fontSize: 40 },
  modeTitle: {
    fontFamily: fonts.display,
    fontSize: type.title,
    color: colors.ink,
    marginTop: space.xs,
  },
  modeSub: {
    fontFamily: fonts.body,
    fontSize: type.caption,
    color: colors.soft,
    marginTop: 2,
    textAlign: "center",
  },
  modeGo: {
    backgroundColor: colors.mist,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: space.sm,
  },
  modeGoText: { fontFamily: fonts.bold, fontSize: type.caption, color: colors.deep },
  reset: {
    fontFamily: fonts.semibold,
    fontSize: type.body,
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: space.lg,
  },
  footnote: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: space.xs,
  },
});
