# Juice-CLI

`juice` launches an animated juice box in your terminal.

## One-command run (no publish needed)

```bash
bash -c 'set -e; if command -v dnf >/dev/null 2>&1; then sudo dnf install -y git nodejs npm; elif command -v pacman >/dev/null 2>&1; then sudo pacman -Sy --needed git nodejs npm; elif command -v apt >/dev/null 2>&1; then sudo apt update && sudo apt install -y git nodejs npm; elif command -v zypper >/dev/null 2>&1; then sudo zypper install -y git nodejs npm; else echo "Unsupported distro: install git + nodejs + npm manually."; exit 1; fi; sudo npm i -g git+https://github.com/3x1om/Juice-CLI.git; juice'
```

## Controls / settings

`juice` now runs continuously until you quit.

- `A` changes `animation` (dancing, pouring, punching)
- `C` changes `color` (classic-orange, fruit-punch-red, berry-blue, lemon-yellow, apple-green, grape-purple, peach, watermelon-pink)
- `Q` quits
- `Ctrl+C` exits

Selected settings are saved to `~/.juice-cli-settings.json`.