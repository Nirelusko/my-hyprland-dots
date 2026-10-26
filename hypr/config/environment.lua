-- Environmental variables (for reference https://wiki.hypr.land/Configuring/Advanced-and-Cool/Environment-variables/)
-- if you use UWSM, define your variables in ~/.config/uwsm/env
-- if you don't use UWSM, define your variables here (e.g. hl.env("QT_QPA_PLATFORM", "wayland"))

-- NVIDIA
 hl.env("GBM_BACKEND", "nvidia-drm")
 hl.env("__GLX_VENDOR_LIBRARY_NAME", "nvidia")
 hl.env("LIBVA_DRIVER_NAME", "nvidia")
 hl.env("__GL_GSYNC_ALLOWED", "1")

 hl.env("QT_QPA_PLATFORM", "wayland")
 hl.env("ELECTRON_OZONE_PLATFORM_HINT", "auto")
 hl.env("MOZ_ENABLE_WAYLAND", "1")
