# API Reference

| 📚 Documentation                        | Description                     |
| --------------------------------------- | ------------------------------- |
| [Getting Started](./getting-started.md) | Installation and basic usage    |
| **API Reference**                       | Props, events, type definitions |
| [Examples](./example.md)                | Practical examples              |

---

## Table of Contents

-   [ChipTabs Props](#chiptab-props)
    -   [Props Overview](#props-overview)
    -   [Detailed Descriptions](#detailed-descriptions)
-   [Event Handlers](#event-handlers)
-   [Type Definitions](#type-definitions)
-   [Cookie Behavior](#cookie-behavior)
-   [Browser Compatibility](#browser-compatibility)

---

## ChipTabs Props

### Props Overview

| Prop                                        | Type                                           | Default | Required | Description                             |
| ------------------------------------------- | ---------------------------------------------- | ------- | -------- | --------------------------------------- |
| [`tabs`](#tabs--required)                   | `ChipTabProps[]`                                   | -       | ✅       | Tab list to display                     |
| [`selectedKey`](#selectedkey)               | `string`                                       | -       | -        | Currently selected tab key (controlled) |
| [`defaultSelected`](#defaultselected)       | `string`                                       | -       | -        | Initial selected tab (uncontrolled)     |
| [`wrap`](#wrap)                             | `boolean`                                      | `true`  | -        | Multi-line wrap enabled                 |
| [`showCloseButton`](#showclosebutton)       | `boolean`                                      | `false` | -        | Show close button on all tabs           |
| [`showArrows`](#showarrows)                 | `boolean`                                      | `true`  | -        | Enable scroll arrows                    |
| [`draggable`](#draggable)                   | `boolean`                                      | `false` | -        | Enable drag-and-drop reordering         |
| [`keyboardNavigation`](#keyboardnavigation) | `boolean`                                      | `true`  | -        | Enable arrow key navigation             |
| [`selectedCookieName`](#selectedcookiename) | `string`                                       | -       | -        | Cookie name for selected tab            |
| [`tabsCookieName`](#tabscookiename)         | `string`                                       | -       | -        | Cookie name for tabs list               |
| [`className`](#classname)                   | `string`                                       | -       | -        | CSS class for root container            |
| [`styles`](#styles)                         | `ChipTabsStyles`                                | -       | -        | Custom style object                     |
| [`onChange`](#onchange)                     | `(event: ChangeEvent) => void`                 | -       | -        | Tab selection change handler            |
| [`onClose`](#onclose)                       | `(key: string) => boolean \| Promise<boolean>` | -       | -        | Close button click handler              |
| [`onReorder`](#onreorder)                   | `(event: ReorderEvent) => void`                | -       | -        | Tab reorder handler                     |

### Detailed Descriptions

#### `tabs` ✅ Required

The list of tabs to display.

```tsx
interface ChipTabProps {
    key: string; // Unique identifier for the tab
    label: string; // Text displayed on the tab
    icon?: ReactNode; // Optional icon
    hideCloseButton?: boolean; // Hide close button for this tab
}
```

#### `selectedKey`

The key of the currently selected tab. Use for controlled component.

```tsx
const [selected, setSelected] = useState("tab1");

<ChipTabs
    tabs={tabs}
    selectedKey={selected}
    onChange={(event) => setSelected(tabs[event.selectedIndex].key)}
/>;
```

#### `defaultSelected`

Initial selected tab. Use for uncontrolled component.

```tsx
<ChipTabs tabs={tabs} defaultSelected="tab1" />
```

#### `wrap`

If `true`, tabs wrap to multiple lines. If `false`, enables horizontal scrolling.

```tsx
<ChipTabs tabs={tabs} wrap={false} />
```

#### `showCloseButton`

Whether to show close button on all tabs.

```tsx
<ChipTabs tabs={tabs} showCloseButton={true} />
```

#### `showArrows`

Whether to enable scroll arrows. When `false`, arrows appear dimmed when disabled.

```tsx
<ChipTabs tabs={tabs} wrap={false} showArrows={true} />
```

#### `draggable`

Whether to enable drag-and-drop reordering of tabs.

```tsx
<ChipTabs tabs={tabs} draggable={true} />
```

#### `keyboardNavigation`

Whether to enable arrow key (← →) navigation between tabs. When enabled, the container is focusable and automatically scrolls to keep the selected tab visible.

```tsx
// Default: enabled
<ChipTabs tabs={tabs} />

// Disabled
<ChipTabs tabs={tabs} keyboardNavigation={false} />
```

#### `selectedCookieName`

When set, automatically saves/loads the selected tab key to/from a cookie.

```tsx
<ChipTabs tabs={tabs} selectedCookieName="my-app-selected-tab" />
```

> **Important**: When a cookie exists, `selectedKey` and `defaultSelected` props are ignored.

#### `tabsCookieName`

When set, automatically saves/loads the tabs array to/from a cookie.

```tsx
<ChipTabs tabs={tabs} tabsCookieName="my-app-tabs" showCloseButton={true} />
```

> **Important**: When a cookie exists, the `tabs` prop is ignored. User's tab modifications (close/reorder) are preserved.

#### `className`

CSS class name to apply to the root container.

```tsx
<ChipTabs tabs={tabs} className="my-custom-tabs" />
```

#### `styles`

Object for customizing tab styles.

```tsx
interface ChipTabsStyles {
    // Basic styles
    height?: string | number;
    fontSize?: string | number;
    borderRadius?: string | number;
    borderWidth?: string | number;
    paddingX?: string | number;
    paddingY?: string | number;
    gap?: string | number;

    // Tab state styles
    defaultTab?: ChipTabStateStyles;
    selectedTab?: ChipTabStateStyles;
    hoverTab?: Omit<ChipTabStateStyles, "fontWeight">;

    // Close button styles
    closeButton?: CloseButtonStyles;
    closeButtonSelected?: CloseButtonStyles;

    // Additional custom styles
    customStyles?: CSSProperties;
}

interface ChipTabStateStyles {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontWeight?: string | number;
}

interface CloseButtonStyles {
    size?: string | number;
    hoverBgColor?: string;
}
```

Example:

```tsx
<ChipTabs
    tabs={tabs}
    styles={{
        height: "48px",
        fontSize: "16px",
        borderRadius: "24px",
        paddingX: "20px",
        gap: "8px",
        selectedTab: {
            backgroundColor: "#3b82f6",
            textColor: "#ffffff",
            borderColor: "#3b82f6",
            fontWeight: 600,
        },
        defaultTab: {
            backgroundColor: "#f9fafb",
            textColor: "#374151",
            borderColor: "#e5e7eb",
        },
        hoverTab: {
            backgroundColor: "#f3f4f6",
            borderColor: "#d1d5db",
        },
        closeButton: {
            size: "16px",
            hoverBgColor: "#fee2e2",
        },
    }}
/>
```

## Event Handlers

### `onChange`

Called when tab selection changes.

```tsx
interface ChangeEvent {
    selectedIndex: number; // Index of newly selected tab
    previousIndex: number; // Index of previously selected tab
}
```

Example:

```tsx
<ChipTabs
    tabs={tabs}
    onChange={(event) => {
        const selectedTab = tabs[event.selectedIndex];
        console.log(
            `${tabs[event.previousIndex].label} → ${selectedTab.label}`
        );
    }}
/>
```

### `onClose`

Called when close button is clicked. Return `true` to remove the tab.

```tsx
<ChipTabs
  tabs={tabs}
  showCloseButton={true}
  onClose={(key) => {
    // Synchronous
    return window.confirm(`Close ${key} tab?`);
  }}
/>

// Or asynchronous
<ChipTabs
  tabs={tabs}
  showCloseButton={true}
  onClose={async (key) => {
    const confirmed = await showCustomDialog();
    return confirmed;
  }}
/>
```

### `onReorder`

Called when tab order is changed via drag-and-drop.

```tsx
interface ReorderEvent {
    fromIndex: number; // Index before move
    toIndex: number; // Index after move
}
```

Example:

```tsx
const [tabs, setTabs] = useState(initialTabs);

<ChipTabs
    tabs={tabs}
    draggable={true}
    onReorder={(event) => {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(event.fromIndex, 1);
        newTabs.splice(event.toIndex, 0, movedTab);
        setTabs(newTabs);
    }}
/>;
```

## Type Definitions

All types are exported from the package:

```tsx
import type {
    ChipTabsProps,
    ChipTabProps,
    ChipTabsStyles,
    ChipTabStateStyles,
    CloseButtonStyles,
    ChangeEvent,
    ReorderEvent,
} from "@ehfuse/chip-tabs";
```

## Cookie Behavior

### `selectedCookieName`

1. **On initial load**:

    - If cookie exists → Use cookie value
    - If no cookie → Use `selectedKey` or `defaultSelected`

2. **On tab selection change**:

    - Automatically save new selection to cookie

3. **On subsequent loads**:
    - Cookie value takes priority, `selectedKey` and `defaultSelected` are ignored

### `tabsCookieName`

1. **On initial load**:

    - If cookie exists → Use cookie's tabs array
    - If no cookie → Use `tabs` prop

2. **On tab add/remove/reorder**:

    - Automatically save changed tabs array to cookie

3. **On subsequent loads**:
    - Cookie's tabs take priority, `tabs` prop is ignored

> ⚠️ **Warning**: When using `tabsCookieName`, users can close all tabs. It's recommended to set `hideCloseButton: true` for at least one tab.

## Browser Compatibility

-   React 18+
-   Modern browsers (Chrome, Firefox, Safari, Edge)
-   CSS Flexbox support required
-   Cookie support required (when using cookie features)

---

## Related Documentation

| 📚 Documentation                        | Description                     |
| --------------------------------------- | ------------------------------- |
| [Getting Started](./getting-started.md) | Installation and basic usage    |
| **API Reference**                       | Props, events, type definitions |
| [Examples](./example.md)                | Practical examples              |
