"use client";

// One reminder a day, inside the Android app only: "see today's rates" at 9 in the
// morning. It is a local notification scheduled on the phone, so nothing is sent
// from a server and no token or identifier leaves the device. Rescheduled on every
// open so the time survives app updates; the permission is asked once.
import { useEffect } from "react";

const ID = 1;
const HOUR = 9;
const ASKED_KEY = "rates-today:notifications-asked";

function isNativeApp() {
  const capacitor = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.());
}

async function setUp() {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  let { display } = await LocalNotifications.checkPermissions();
  if (display === "prompt" || display === "prompt-with-rationale") {
    // Ask on the second open, not the first, so the first screen is the rates.
    let asked = false;
    try {
      asked = localStorage.getItem(ASKED_KEY) === "1";
      localStorage.setItem(ASKED_KEY, "1");
    } catch {
      // Storage blocked: ask now.
    }
    if (!asked) return;
    display = (await LocalNotifications.requestPermissions()).display;
  }
  if (display !== "granted") return;
  await LocalNotifications.schedule({
    notifications: [
      {
        id: ID,
        title: "Aaj ke rates",
        body: "Dollar, gold aur petrol ka aaj ka rate dekhein",
        schedule: { on: { hour: HOUR, minute: 0 }, allowWhileIdle: true },
        // An inexact alarm is enough for a reminder and needs no "Alarms & reminders" permission.
        isExactNotification: false,
      },
    ],
  });
}

export function AppNotifications() {
  useEffect(() => {
    if (!isNativeApp()) return;
    setUp().catch(() => {
      // Plugin missing or permission screen dismissed: the app works without the reminder.
    });
  }, []);
  return null;
}
