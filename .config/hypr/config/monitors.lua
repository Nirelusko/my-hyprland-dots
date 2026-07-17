------------------
---- MONITORS ----
------------------

-- ~/.config/hypr/config/monitors.lua

-- Main Monitor: ASUS ROG (Left side, set to max 165Hz)
hl.monitor({
    output   = "DP-1",
    mode     = "2560x1440@165",
    position = "0x0",
    scale    = 1
})

-- Secondary Monitor: AOC (Right side, set to max 144Hz, positioned at 2560x0)
hl.monitor({
    output   = "DP-2",
    mode     = "2560x1440@143.91",
    position = "2560x0",
    scale    = 1
})
