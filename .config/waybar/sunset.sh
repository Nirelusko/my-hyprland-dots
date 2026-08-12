#!/usr/bin/env bash

STATE_FILE="$HOME/.cache/hyprsunset_active"
TARGET_TEMP=3500
MAX_TEMP=6500  # Normal, neutral screen temperature
STEP=150        # How many Kelvin steps to jump per loop cycle
DELAY=0.01      # The animation speed delay (lower is faster fading)

if [ "$1" = "toggle" ]; then
    if [ -f "$STATE_FILE" ]; then
        rm "$STATE_FILE"
        
        # Smoothly fade OUT from warm to cool
        CURRENT=$TARGET_TEMP
        while [ $CURRENT -lt $MAX_TEMP ]; do
            CURRENT=$((CURRENT + STEP))
            hyprctl hyprsunset temperature $CURRENT > /dev/null
            sleep $DELAY
        done
        
        # Fully clear shader pipeline once fade finishes
        hyprctl hyprsunset identity > /dev/null
    else
        touch "$STATE_FILE"
        
        # Smoothly fade IN from cool to warm
        CURRENT=$MAX_TEMP
        while [ $CURRENT -gt $TARGET_TEMP ]; do
            CURRENT=$((CURRENT - STEP))
            hyprctl hyprsunset temperature $CURRENT > /dev/null
            sleep $DELAY
        done
    fi
    pkill -SIGRTMIN+10 waybar
    exit 0
fi

if [ -f "$STATE_FILE" ]; then
    echo " "  # Moon
else
    echo " "  # Sun
fi

