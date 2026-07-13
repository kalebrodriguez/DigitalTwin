import React, { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { colors, radius, buttonHeight, space, type } from "./src/theme";
import { resetDay } from "./src/store";
import PatientScreen from "./src/PatientScreen";
import CaregiverScreen from "./src/CaregiverScreen";

type Mode = "select" | "patient" | "caregiver";

export default function App() {
  const [mode, setMode] = useState<Mode>("select");

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={mode === "caregiver" ? "light-content" : "dark-content"} />
      {mode === "patient" && <PatientScreen onExit={() => setMode("select")} />}
      {mode === "caregiver" && <CaregiverScreen onExit={() => setMode("select")} />}
      {mode === "select" && (
        <View style={styles.screen}>
          <Text style={styles.logo}>
            Digital<Text style={{ color: colors.primary }}>Twin</Text>
          </Text>
          <Text style={styles.tagline}>
            An AI daily companion for Mom.{"\n"}Real-time peace of mind for you.
          </Text>

          <Pressable
            style={[styles.modeBtn, { backgroundColor: colors.primary }]}
            onPress={() => setMode("patient")}
          >
            <Text style={styles.modeBtnText}>🌼  Patient Mode</Text>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, { backgroundColor: colors.primaryDark }]}
            onPress={() => setMode("caregiver")}
          >
            <Text style={styles.modeBtnText}>👀  Caregiver Mode</Text>
          </Pressable>

          <Pressable onPress={resetDay} hitSlop={16}>
            <Text style={styles.reset}>Restart demo day</Text>
          </Pressable>
          <Text style={styles.footnote}>Demo prototype — scripted data</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: space.md,
  },
  logo: { fontSize: 44, fontWeight: "800", color: colors.ink },
  tagline: {
    fontSize: type.body,
    color: colors.soft,
    textAlign: "center",
    marginTop: space.xs,
    marginBottom: space.xl,
    lineHeight: 26,
  },
  modeBtn: {
    height: buttonHeight,
    borderRadius: radius,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  modeBtnText: { fontSize: type.button, fontWeight: "800", color: "#fff" },
  reset: {
    fontSize: type.body,
    color: colors.primaryDark,
    textDecorationLine: "underline",
    marginTop: space.md,
  },
  footnote: { fontSize: 14, color: colors.soft, marginTop: space.xs },
});
