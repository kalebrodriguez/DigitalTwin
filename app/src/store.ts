// Local demo store — scripted data, no backend. Both modes read from here so
// a confirmation in Patient Mode shows up instantly in Caregiver Mode.

export type Task = {
  id: string;
  emoji: string;
  title: string;
  sub: string;
  voiceHint: string;
  time: string;
  label: string;
  goodTitle: string;
  goodText: string;
  warnTitle: string;
  warnText: string;
};

export type FeedEvent = {
  id: string;
  kind: "good" | "warn" | "info";
  icon: string;
  title: string;
  text: string;
  time: string;
  needsAction: boolean;
};

export const PATIENT_NAME = "Margaret";
export const CAREGIVER_NAME = "Sarah";

export const TASKS: Task[] = [
  {
    id: "meds",
    emoji: "💊",
    title: "Time for your morning pills",
    sub: "The white one and the small blue one, with a glass of water.",
    voiceHint: "“Margaret, it's nine o'clock — time for your morning medicine.”",
    time: "9:02 AM",
    label: "Morning medication",
    goodTitle: "Medication taken ✓",
    goodText: "Mom confirmed her morning pills at 9:02 AM.",
    warnTitle: "Missed: morning medication",
    warnText: "Mom hasn't confirmed her 9:00 AM pills after 30 minutes and two gentle reminders.",
  },
  {
    id: "dog",
    emoji: "🐕",
    title: "Time to feed Biscuit",
    sub: "One scoop of the brown kibble, in his blue bowl by the door.",
    voiceHint: "“Biscuit is probably hungry! One scoop in the blue bowl.”",
    time: "10:15 AM",
    label: "Feed the dog",
    goodTitle: "Biscuit is fed ✓",
    goodText: "Mom confirmed feeding Biscuit at 10:15 AM.",
    warnTitle: "Missed: feeding Biscuit",
    warnText: "No confirmation that Biscuit was fed this morning.",
  },
  {
    id: "lunch",
    emoji: "🥪",
    title: "Lunchtime, Margaret",
    sub: "There's a sandwich ready in the fridge, on the middle shelf.",
    voiceHint: "“It's noon — your sandwich is waiting in the fridge.”",
    time: "12:04 PM",
    label: "Lunch",
    goodTitle: "Lunch eaten ✓",
    goodText: "Mom confirmed she had lunch at 12:04 PM.",
    warnTitle: "Missed: lunch",
    warnText: "Mom hasn't confirmed lunch after reminders at 12:00 and 12:20.",
  },
  {
    id: "call",
    emoji: "📞",
    title: "Call your daughter Sarah",
    sub: "Just tap the button and I'll dial her for you.",
    voiceHint: "“Sarah would love to hear from you. Shall I call her?”",
    time: "3:30 PM",
    label: "Family call",
    goodTitle: "Called Sarah ✓",
    goodText: "Mom and Sarah talked for 12 minutes this afternoon. ❤️",
    warnTitle: "Missed: afternoon call",
    warnText: "Mom didn't get to her call with Sarah today.",
  },
];

export type TaskOutcome = "done" | "missed";

type State = {
  taskIndex: number; // index into TASKS; TASKS.length means day complete
  outcomes: Record<string, TaskOutcome>;
  feed: FeedEvent[];
  status: "ok" | "alert";
};

let state: State = initialState();
let nextEventId = 1;

function initialState(): State {
  return {
    taskIndex: 0,
    outcomes: {},
    feed: [
      {
        id: "e0",
        kind: "info",
        icon: "☀️",
        title: "Margaret is up and about",
        text: "Morning routine started on schedule at 8:45 AM.",
        time: "8:45 AM",
        needsAction: false,
      },
    ],
    status: "ok",
  };
}

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function getState(): State {
  return state;
}

export function currentTask(): Task | null {
  return state.taskIndex < TASKS.length ? TASKS[state.taskIndex] : null;
}

export function completedCount(): number {
  return Object.values(state.outcomes).filter((o) => o === "done").length;
}

export function adherencePct(): number {
  const answered = Object.keys(state.outcomes).length;
  if (answered === 0) return 100;
  return Math.round((completedCount() / answered) * 100);
}

function pushEvent(e: Omit<FeedEvent, "id">) {
  state = { ...state, feed: [{ ...e, id: `e${nextEventId++}` }, ...state.feed] };
}

function maybeFinishDay() {
  if (state.taskIndex >= TASKS.length) {
    pushEvent({
      kind: "info",
      icon: "🌙",
      title: "Daily summary ready",
      text: `Margaret completed ${completedCount()} of ${TASKS.length} tasks today. Tap to see the full summary and trends.`,
      time: "8:00 PM",
      needsAction: false,
    });
  }
}

export function confirmTask() {
  const t = currentTask();
  if (!t) return;
  state = {
    ...state,
    taskIndex: state.taskIndex + 1,
    outcomes: { ...state.outcomes, [t.id]: "done" },
    status: "ok",
  };
  pushEvent({
    kind: "good",
    icon: "✅",
    title: t.goodTitle,
    text: t.goodText,
    time: t.time,
    needsAction: false,
  });
  maybeFinishDay();
  emit();
}

export function missTask() {
  const t = currentTask();
  if (!t) return;
  state = {
    ...state,
    taskIndex: state.taskIndex + 1,
    outcomes: { ...state.outcomes, [t.id]: "missed" },
    status: "alert",
  };
  pushEvent({
    kind: "warn",
    icon: "⚠️",
    title: t.warnTitle,
    text: t.warnText,
    time: t.time,
    needsAction: true,
  });
  maybeFinishDay();
  emit();
}

export function resolveAlert(eventId: string) {
  state = {
    ...state,
    status: "ok",
    feed: state.feed.map((e) =>
      e.id === eventId
        ? {
            ...e,
            kind: "good",
            icon: "✅",
            needsAction: false,
            title: "You called Mom — she's okay",
            text: "She took care of it while you were on the phone.",
          }
        : e
    ),
  };
  emit();
}

export function resetDay() {
  state = initialState();
  emit();
}
