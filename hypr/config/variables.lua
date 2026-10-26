-- Hyprland default apps

TERMINAL     = "kitty"
FILE_MANAGER = "dolphin"
BROWSER      = "zen-browser"
EDITOR       = "gnome-text-editor --new-window"
CALCULATOR   = "gnome-calculator"
DISCORD      = "vesktop"
MUSIC	     = "pear-desktop"

-- Monitors
-- Matched by EDID description, not by connector name (DP-1/DP-2). Connector
-- numbering shifts whenever cables are replugged or moved to another GPU port,
-- which silently retargets every rule that references it.
MONITOR1 = "desc:Ancor Communications Inc ROG PG279Q"
MONITOR2 = "desc:AOC Q27G2WG4"
PRIMARY_MONITOR = MONITOR1

-- Monitor modes/scales
MONITOR1_MODE  = "2560x1440@165.0"
MONITOR1_SCALE = 1.0
MONITOR2_MODE  = "2560x1440@144.0"
MONITOR2_SCALE = 1.0

-- Workspaces
NUM_WPM = 5 -- Number of workspaces per monitor (Max 10)
