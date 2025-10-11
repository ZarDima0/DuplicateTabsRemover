# Duplicate Tabs Remover

A lightweight Chrome extension that helps you find and remove duplicate tabs with ease.

## Features

- 🔍 **Automatic Detection** - Instantly finds all duplicate tabs across all windows
- 📊 **Smart Grouping** - Groups duplicates by URL for easy review
- ❌ **Individual Control** - Close duplicate tabs one by one with a simple click
- 🗑️ **Bulk Action** - Remove all duplicates at once while keeping one tab per URL
- 🔄 **Real-time Updates** - Refresh the list anytime to see current duplicates
- 🎨 **Clean Interface** - Simple and intuitive popup design

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right corner)
4. Click **Load unpacked**
5. Select the extension folder

## Usage

1. Click the extension icon in your Chrome toolbar
2. View all duplicate tabs grouped by URL
3. **Close individual duplicates** - Click the × button next to any tab
4. **Close all duplicates** - Click "Close All Duplicates" button to remove all at once
5. **Refresh** - Click "Refresh" to update the list

The extension keeps one tab per URL and marks the rest as duplicates.

## Files Structure

```
DuplicateTabsRemover/
├── icons/              # Icons folder
│   ├── icon16.png      # 16x16 icon
│   ├── icon48.png      # 48x48 icon
│   └── icon128.png     # 128x128 icon
├── manifest.json       # Extension configuration
├── popup.html          # Popup interface
├── popup.css           # Styles
├── popup.js            # Core functionality
└── README.md           # This file
```

## How It Works

The extension:

1. Queries all open tabs using Chrome's Tabs API
2. Groups tabs by their URL
3. Identifies URLs with multiple instances as duplicates
4. Displays duplicates in an organized list
5. Allows selective or bulk removal while preserving one tab per URL

## Permissions

- `tabs` - Required to access and manage browser tabs

## Browser Compatibility

- Chrome (Manifest V3)
- Other Chromium-based browsers (Edge, Brave, etc.)

## Development

### Tech Stack

- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- CSS3

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Privacy

This extension:

- ✅ Works completely offline
- ✅ Does not collect any data
- ✅ Does not make external network requests
- ✅ Only accesses tab information locally

## License

MIT License - feel free to use and modify as needed.

## Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Tip:** To avoid duplicates in the future, use `Ctrl+Shift+T` (`Cmd+Shift+T` on Mac) to restore recently closed tabs instead of reopening URLs manually.