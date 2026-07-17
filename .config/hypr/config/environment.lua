--------------------------------------------------------
---- ENVIRONMENT VARIABLES & GLOBAL CONFIG  ----
--------------------------------------------------------

hl.env("XCURSOR_SIZE", "24")
hl.env("HYPRCURSOR_SIZE", "24")
hl.config({
    cursor = {
        warp_on_change_workspace = false,
        no_warps = false -- Change back to false
    },
    input = {
        follow_mouse = 1,
        mouse_refocus = false
    }
})
