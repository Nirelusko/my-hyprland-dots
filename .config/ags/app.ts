import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib?version=2.0"
import Astal from "gi://Astal?version=4.0"
import app from "ags/gtk4/app"

function sh<T>(cmd: string, fn: (out: string) => T, fallback: T): T {
  try {
    const [ok, stdout] = GLib.spawn_command_line_sync(`bash -c ${GLib.shell_quote(cmd)}`)
    if (ok && stdout) return fn(new TextDecoder().decode(stdout).trim())
  } catch {}
  return fallback
}

function createVolumePopup(): Astal.Window {
  const refresh = () => {
    const vol = sh("pamixer --get-volume", parseInt, 0)
    const mute = sh("pamixer --get-mute", (o) => o === "true", false)
    volumeLabel.label = mute ? "🔇 Muted" : `🔊 ${vol}%`
    slider.value = vol
    muteBtn.active = mute
  }

  const slider = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 0, 150, 2)
  slider.drawValue = false
  slider.hexpand = true
  slider.connect("value-changed", () => {
    sh(`pamixer --set-volume ${Math.round(slider.value)}`, () => {}, undefined)
  })

  const volumeLabel = new Gtk.Label({
    cssClasses: ["popup-label"],
  })

  const muteBtn = new Gtk.ToggleButton({
    child: new Gtk.Label({ label: "🔇 Mute" }),
  })
  muteBtn.connect("toggled", () => {
    sh(`pamixer ${muteBtn.active ? "--mute" : "--unmute"}`, () => {}, undefined)
    refresh()
  })

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 12,
    marginTop: 16,
    marginBottom: 16,
    marginStart: 20,
    marginEnd: 20,
  })
  box.append(volumeLabel)
  box.append(slider)
  box.append(muteBtn)

  const win = new Astal.Window({
    name: "volume-popup",
    layer: Astal.Layer.OVERLAY,
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
    marginTop: 46,
    marginRight: 256,
    visible: false,
    child: box,
    cssClasses: ["popup-window"],
  })

  win.connect("notify::visible", () => {
    if (win.visible) refresh()
  })

  return win
}

function createCalendarPopup(): Astal.Window {
  const calendar = new Gtk.Calendar()

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    marginTop: 16,
    marginBottom: 16,
    marginStart: 16,
    marginEnd: 16,
  })
  box.append(calendar)

  const win = new Astal.Window({
    name: "calendar-popup",
    layer: Astal.Layer.OVERLAY,
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
    marginTop: 46,
    marginRight: 8,
    visible: false,
    child: box,
    cssClasses: ["popup-window"],
  })

  return win
}

function createNetworkPopup(): Astal.Window {
  const refresh = () => {
    const wifi = sh("nmcli -t -f active,ssid dev wifi | grep '^yes' | cut -d: -f2", (o) => o || "None", "None")
    const eth = sh("nmcli -t -f type,state dev | grep '^ethernet:connected'", (o) => "Connected", "Disconnected")
    const ip = sh("nmcli -t -f ip4 addr show | head -1 | cut -d/ -f1", (o) => o || "No IP", "No IP")
    ssidLabel.label = `WiFi: ${wifi}`
    ethLabel.label = `Ethernet: ${eth}`
    ipLabel.label = `IP: ${ip}`
  }

  const ssidLabel = new Gtk.Label({ cssClasses: ["popup-label"], xalign: 0 })
  const ethLabel = new Gtk.Label({ cssClasses: ["popup-label"], xalign: 0 })
  const ipLabel = new Gtk.Label({ cssClasses: ["popup-label"], xalign: 0 })

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 8,
    marginTop: 16,
    marginBottom: 16,
    marginStart: 20,
    marginEnd: 20,
  })
  box.append(ssidLabel)
  box.append(ethLabel)
  box.append(ipLabel)

  const win = new Astal.Window({
    name: "network-popup",
    layer: Astal.Layer.OVERLAY,
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
    marginTop: 46,
    marginRight: 180,
    visible: false,
    child: box,
    cssClasses: ["popup-window"],
  })

  win.connect("notify::visible", () => {
    if (win.visible) refresh()
  })

  return win
}

function createMusicPopup(): Astal.Window {
  const refresh = () => {
    const title = sh("playerctl metadata title 2>/dev/null || echo ''", (o) => o, "")
    const artist = sh("playerctl metadata artist 2>/dev/null || echo ''", (o) => o, "")
    const status = sh("playerctl status 2>/dev/null || echo 'Stopped'", (o) => o, "Stopped")
    if (title) {
      titleLabel.label = title
      artistLabel.label = artist ? artist : ""
      playBtn.child.label = status === "Playing" ? "⏸" : "▶"
    } else {
      titleLabel.label = "No track playing"
      artistLabel.label = ""
      playBtn.child.label = "▶"
    }
  }

  const titleLabel = new Gtk.Label({
    cssClasses: ["popup-title"],
    wrap: true,
    maxWidthChars: 30,
  })
  const artistLabel = new Gtk.Label({
    cssClasses: ["popup-artist"],
  })

  const prevBtn = new Gtk.Button({
    child: new Gtk.Label({ label: "⏮" }),
  })
  const playBtn = new Gtk.Button({
    child: new Gtk.Label({ label: "▶" }),
  })
  const nextBtn = new Gtk.Button({
    child: new Gtk.Label({ label: "⏭" }),
  })

  prevBtn.connect("clicked", () => {
    GLib.spawn_command_line_async("playerctl previous")
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => { refresh(); return false })
  })
  playBtn.connect("clicked", () => {
    GLib.spawn_command_line_async("playerctl play-pause")
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => { refresh(); return false })
  })
  nextBtn.connect("clicked", () => {
    GLib.spawn_command_line_async("playerctl next")
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => { refresh(); return false })
  })

  const controls = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL,
    spacing: 8,
    halign: Gtk.Align.CENTER,
  })
  controls.append(prevBtn)
  controls.append(playBtn)
  controls.append(nextBtn)

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 12,
    marginTop: 16,
    marginBottom: 16,
    marginStart: 20,
    marginEnd: 20,
  })
  box.append(titleLabel)
  box.append(artistLabel)
  box.append(controls)

  const win = new Astal.Window({
    name: "music-popup",
    layer: Astal.Layer.OVERLAY,
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
    marginTop: 46,
    marginRight: 8,
    visible: false,
    child: box,
    cssClasses: ["popup-window"],
  })

  win.connect("notify::visible", () => {
    if (win.visible) refresh()
  })

  return win
}

function createSystemPopup(): Astal.Window {
  const btn = (label: string, cmd: string, color?: string) => {
    const b = new Gtk.Button({ child: new Gtk.Label({ label }) })
    b.connect("clicked", () => GLib.spawn_command_line_async(cmd))
    return b
  }

  const box = new Gtk.Box({
    orientation: Gtk.Orientation.VERTICAL,
    spacing: 6,
    marginTop: 12,
    marginBottom: 12,
    marginStart: 16,
    marginEnd: 16,
  })
  box.append(btn("⏻ Shutdown", "systemctl poweroff"))
  box.append(btn("↻ Reboot", "systemctl reboot"))
  box.append(btn("⇤ Logout", "loginctl terminate-session $XDG_SESSION_ID"))
  box.append(btn("⏾ Suspend", "systemctl suspend"))

  const win = new Astal.Window({
    name: "system-popup",
    layer: Astal.Layer.OVERLAY,
    anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
    marginTop: 46,
    marginRight: 8,
    visible: false,
    child: box,
    cssClasses: ["popup-window"],
  })

  return win
}

app.start({
  instanceName: "widgets",
  gtkTheme: "Adwaita-dark",
  css: `${GLib.get_home_dir()}/.config/ags/style.css`,
  main() {
    app.add_window(createVolumePopup())
    app.add_window(createCalendarPopup())
    app.add_window(createNetworkPopup())
    app.add_window(createMusicPopup())
    app.add_window(createSystemPopup())
  },
})
