# Retro Number Generator

A retro-themed random game selector for RetroAchievements with multiple modes for different use cases.

## Features

### 🎮 Three Distinct Modes
- **Player Mode** (🌟): Random game selection from games with achievement sets
- **Dev Mode** (💀): Claim unclaimed games for development
- **Jr-Dev Mode** (🌱): Learning-focused environment with curated system selection

### 🎯 Mode-Specific Features
- **Separate Roll Counters**: Each mode maintains its own roll count
- **Independent Histories**: Separate roll history for each mode
- **Mode-Specific Filters**: Different system and type exclusions per mode
- **Unique Themes**: Distinct visual themes and sound effects per mode

## Usage

### Basic Operation
1. **Select Mode**: Choose Player, Dev, or Jr-Dev tab
2. **Configure Filters**: Toggle systems and game types to include/exclude
3. **Roll**: Click the roll button or press Enter/Space
4. **View Results**: See selected game with direct link to RetroAchievements

### Advanced Features
- **Column Controls**: Use "ALL/NONE" buttons to toggle entire system groups
- **Bulk Selection**: Hold Shift while clicking for multi-select
- **Reset Counters**: Add `?reset` to URL to clear all roll counts
- **Keyboard Shortcuts**: Enter or Space to roll (when not focused on buttons)

## File Structure

```
├── Index.html          # Main application
├── Index.css           # Stylesheet
├── ra_games.js         # Player mode game data
├── ra_games_dev.js     # Dev mode game data
├── PlayerSFX.mp3      # Play mode sound effect
├── DevSFX.mp3         # Dev mode sound effect
└── Jr-DevSFX.mp3      # Jr-Dev mode sound effect
```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile**: Responsive design works on modern mobile browsers

## Technical Details

### Data Sources
- **Local Storage**: Persists user preferences and histories
- **No Server Required**: Runs entirely in browser

### Storage Keys
- Mode preferences: `ra_mode_v2`
- System exclusions: `ra_excl_[mode]_v2`
- Type exclusions: `ra_excl_[mode]_v2`
- Roll counts: `ra_rolls_[mode]_v2`
- Histories: `ra_hist_[mode]_v2`

## License

This project is open source and available under the MIT License. See [LICENSE](LICENSE) file for details.

## Contributing

Contributions welcome! Please ensure:
- Code follows existing style conventions
- Features maintain mode separation
- New features include proper documentation
- Tests pass for all three modes

---

*Built with ❤️ for the RetroAchievements community*