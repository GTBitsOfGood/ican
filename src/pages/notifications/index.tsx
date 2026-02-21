import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import { useSettings, useUpdateSettings } from "@/components/hooks/useSettings";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { UpdateNotificationPreferencesBody } from "@/types/settings";

type NotifType = "early" | "on_time" | "missed";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
      <span className="text-white">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-blue-500"
      />
    </label>
  );
}

export default function NotificationsPage() {
  const { userId } = useUser();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const router = useRouter();

  const prefs = settings?.notificationPreferences;

  const updatePrefs = (patch: UpdateNotificationPreferencesBody) => {
    updateSettings.mutate({ notificationPreferences: patch });
  };

  const handleTypeToggle = (type: NotifType, enabled: boolean) => {
    if (!prefs) return;
    const current = prefs.types || [];
    const updated = enabled
      ? [...current, type]
      : current.filter((t) => t !== type);
    updatePrefs({ types: updated });
  };

  const triggerTestToast = () => {
    toast("This is a test medication notification!", {
      icon: "\u{1F48A}",
      duration: 5000,
      position: "top-right",
      style: {
        borderRadius: "12px",
        background: "#1a1a2e",
        color: "#fff",
        border: "2px solid #4a90d9",
        fontFamily: "Quantico, sans-serif",
      },
    });
  };

  return (
    <AuthorizedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-6 font-quantico">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-400 hover:text-blue-300"
          >
            &larr; Back
          </button>

          <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>

          {!settings ? (
            <p className="text-gray-400">Loading settings...</p>
          ) : (
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold mb-3 text-blue-400">
                  Master Toggle
                </h2>
                <Toggle
                  label="Notifications Enabled"
                  checked={settings.notifications}
                  onChange={(v) => updateSettings.mutate({ notifications: v })}
                />
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3 text-blue-400">
                  Notification Types
                </h2>
                <div className="space-y-2">
                  <Toggle
                    label="Early Reminder"
                    checked={prefs?.types?.includes("early") ?? true}
                    onChange={(v) => handleTypeToggle("early", v)}
                  />
                  <Toggle
                    label="On-Time Reminder"
                    checked={prefs?.types?.includes("on_time") ?? true}
                    onChange={(v) => handleTypeToggle("on_time", v)}
                  />
                  <Toggle
                    label="Missed Dose Alert"
                    checked={prefs?.types?.includes("missed") ?? true}
                    onChange={(v) => handleTypeToggle("missed", v)}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3 text-blue-400">
                  Early Notification Window
                </h2>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <span className="text-white">Notify</span>
                  <select
                    value={prefs?.earlyWindow ?? 15}
                    onChange={(e) =>
                      updatePrefs({ earlyWindow: Number(e.target.value) })
                    }
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                  </select>
                  <span className="text-white">minutes before</span>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3 text-blue-400">
                  Delivery Channels
                </h2>
                <div className="space-y-2">
                  <Toggle
                    label="Real-Time Notifications"
                    checked={prefs?.realTimeEnabled ?? true}
                    onChange={(v) => updatePrefs({ realTimeEnabled: v })}
                  />
                  <Toggle
                    label="Email Fallback"
                    checked={prefs?.emailEnabled ?? true}
                    onChange={(v) => updatePrefs({ emailEnabled: v })}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3 text-blue-400">
                  Test
                </h2>
                <button
                  onClick={triggerTestToast}
                  className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors"
                >
                  Send Test Toast
                </button>
              </section>

              {userId && (
                <p className="text-xs text-gray-500 text-center">
                  Channel: notifications:{userId}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthorizedRoute>
  );
}
