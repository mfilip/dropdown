# Input Dropdown

A lightweight dropdown positioning library for input and textarea elements.

## Features

- **Width matching** - Dropdown width automatically matches the reference input/textarea
- **Auto-flip** - Flips to top when there's not enough space below
- **Auto-update** - Repositions on scroll, resize, and element size changes
- **Lightweight** - No dependencies, ~2KB minified

## Installation

```bash
npm install input-dropdown
```

## Usage

### Basic Usage

```typescript
import { computePosition, applyPosition } from 'input-dropdown';

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');

const position = computePosition(input, dropdown, {
  placement: 'bottom',
  offset: 4,
});

applyPosition(dropdown, position);
```

### With Auto-Update

```typescript
import { computePosition, applyPosition, autoUpdate } from 'input-dropdown';

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');

const cleanup = autoUpdate(input, dropdown, () => {
  const position = computePosition(input, dropdown, {
    placement: 'bottom',
    offset: 4,
  });
  applyPosition(dropdown, position);
});

// Call cleanup when done
cleanup();
```

### Using createDropdown Helper

```typescript
import { createDropdown } from 'input-dropdown';

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');

const instance = createDropdown(input, dropdown, {
  placement: 'bottom',
  offset: 4,
  flipOnOverflow: true,
});

// Show/hide the dropdown
instance.show();
instance.hide();

// Check visibility
console.log(instance.isVisible());

// Manual update
instance.update();

// Cleanup
instance.destroy();
```

## API

### computePosition(reference, floating, config?)

Computes the position for the dropdown.

**Parameters:**
- `reference` - The input or textarea element
- `floating` - The dropdown element
- `config` - Optional configuration object
  - `placement` - `'bottom'` | `'top'` (default: `'bottom'`)
  - `offset` - Spacing in pixels (default: `0`)
  - `flipOnOverflow` - Flip placement when overflow detected (default: `true`)

**Returns:** `Position` object with `x`, `y`, `width`, and `placement`.

### applyPosition(floating, position)

Applies the computed position to the dropdown element.

### autoUpdate(reference, floating, update, options?)

Automatically updates position on scroll/resize.

**Options:**
- `ancestorScroll` - Update on ancestor scroll (default: `true`)
- `ancestorResize` - Update on ancestor resize (default: `true`)
- `elementResize` - Update on element resize (default: `true`)

**Returns:** Cleanup function.

### createDropdown(reference, floating, config?)

Creates a dropdown instance with show/hide controls.

**Returns:** `DropdownInstance` with methods:
- `show()` - Show and start auto-updating
- `hide()` - Hide and stop auto-updating
- `update()` - Manually update position
- `destroy()` - Cleanup all listeners
- `isVisible()` - Check if dropdown is visible

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run demo
npm run demo
```

## License

MIT
