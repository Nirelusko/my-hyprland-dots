if status is-interactive
# Commands to run in interactive sessions can go here
end
function rofi
    command rofi -show drun -theme ~/.config/rofi/launchers/type-3/style-2.rasi $argv
end
