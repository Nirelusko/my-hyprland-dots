hl.config({
    dwindle = {
        preserve_split = true,
    },
    misc = {
        col = {
            splash = CACHYLGREEN,
        },
        middle_click_paste = false,
        enable_swallow = true,
        swallow_regex = "(kitty|ghostty|[Kk]onsole|Alacritty|gnome-terminal|xfce[0-9]?-terminal)",
        vrr = 2, -- 0 off, 1 on, 2 fullscreen only, 3 fullscreen + video
        disable_hyprland_logo = true,
    },
    xwayland = {
        force_zero_scaling = false,
    },
    ecosystem = {
        no_update_news = true,
        no_donation_nag = true,
    },
})