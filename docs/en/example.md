# Examples

| 📚 Documentation                        | Description                     |
| --------------------------------------- | ------------------------------- |
| [Getting Started](./getting-started.md) | Installation and basic usage    |
| [API Reference](./api.md)               | Props, events, type definitions |
| **Examples**                            | Practical examples              |

---

## Table of Contents

### Basic Examples

-   [1. Simple Tabs](#1-simple-tabs)
-   [2. Controlled Component](#2-controlled-component)

### Advanced Examples

-   [3. Closeable Tabs](#3-closeable-tabs)
-   [4. Drag and Drop](#4-drag-and-drop)
-   [5. Tabs with Icons](#5-tabs-with-icons)
-   [6. Scroll Mode](#6-scroll-mode)
-   [7. Cookie Persistence - Selection Only](#7-cookie-persistence---selection-only)
-   [8. Cookie Persistence - Full](#8-cookie-persistence---full)
-   [9. Custom Styling](#9-custom-styling)
-   [10. Combined Example](#10-combined-example)

### Practical Tips

-   [Tab Count Limit](#tab-count-limit)
-   [Dynamic Tab Addition](#dynamic-tab-addition)
-   [Tab Data Integration](#tab-data-integration)
-   [Conditional Tab Display](#conditional-tab-display)

---

## Basic Examples

### 1. Simple Tabs

The most basic usage.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function BasicExample() {
    const tabs = [
        { key: "home", label: "Home" },
        { key: "products", label: "Products" },
        { key: "about", label: "About" },
    ];

    return <ChipTabs tabs={tabs} defaultSelected="home" />;
}
```

### 2. Controlled Component

Manage state directly.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function ControlledExample() {
    const [selected, setSelected] = useState("tab1");
    const tabs = [
        { key: "tab1", label: "Tab 1" },
        { key: "tab2", label: "Tab 2" },
        { key: "tab3", label: "Tab 3" },
    ];

    return (
        <div>
            <ChipTabs
                tabs={tabs}
                selectedKey={selected}
                onChange={(event) => setSelected(tabs[event.selectedIndex].key)}
            />
            <div>Current: {selected}</div>
        </div>
    );
}
```

## Advanced Examples

### 3. Closeable Tabs

Close tabs with confirmation dialog.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function CloseableTabsExample() {
    const [tabs, setTabs] = useState([
        { key: "tab1", label: "Tab 1" },
        { key: "tab2", label: "Tab 2" },
        { key: "tab3", label: "Tab 3" },
    ]);
    const [selected, setSelected] = useState("tab1");

    const handleClose = (key: string) => {
        const confirmed = window.confirm(`Close "${key}" tab?`);
        if (confirmed) {
            setTabs(tabs.filter((tab) => tab.key !== key));

            // Move to first tab if closing current selection
            if (key === selected && tabs.length > 1) {
                setSelected(tabs[0].key);
            }
        }
        return confirmed;
    };

    return (
        <ChipTabs
            tabs={tabs}
            selectedKey={selected}
            showCloseButton={true}
            onChange={(event) => setSelected(tabs[event.selectedIndex].key)}
            onClose={handleClose}
        />
    );
}
```

### 4. Drag and Drop

Reorder tabs by dragging.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function DraggableTabsExample() {
    const [tabs, setTabs] = useState([
        { key: "tab1", label: "Tab 1" },
        { key: "tab2", label: "Tab 2" },
        { key: "tab3", label: "Tab 3" },
        { key: "tab4", label: "Tab 4" },
    ]);

    const handleReorder = (event: ReorderEvent) => {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(event.fromIndex, 1);
        newTabs.splice(event.toIndex, 0, movedTab);
        setTabs(newTabs);

        console.log(`Tab moved: ${event.fromIndex} → ${event.toIndex}`);
    };

    return <ChipTabs tabs={tabs} draggable={true} onReorder={handleReorder} />;
}
```

### 5. Tabs with Icons

Add icons to each tab.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";
import { HomeIcon, UserIcon, SettingsIcon } from "./icons";

function IconTabsExample() {
    const tabs = [
        {
            key: "home",
            label: "Home",
            icon: <HomeIcon />,
        },
        {
            key: "profile",
            label: "Profile",
            icon: <UserIcon />,
        },
        {
            key: "settings",
            label: "Settings",
            icon: <SettingsIcon />,
        },
    ];

    return <ChipTabs tabs={tabs} defaultSelected="home" />;
}
```

### 6. Scroll Mode

Useful for displaying many tabs in limited space.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function ScrollModeExample() {
    const tabs = Array.from({ length: 20 }, (_, i) => ({
        key: `tab${i + 1}`,
        label: `Tab ${i + 1}`,
    }));

    return (
        <div style={{ maxWidth: "600px" }}>
            <ChipTabs tabs={tabs} wrap={false} defaultSelected="tab1" />
        </div>
    );
}
```

### 7. Cookie Persistence - Selection Only

Save only the selected tab to cookie.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function CookieSelectionExample() {
    const tabs = [
        { key: "dashboard", label: "Dashboard" },
        { key: "analytics", label: "Analytics" },
        { key: "reports", label: "Reports" },
    ];

    return (
        <ChipTabs
            tabs={tabs}
            selectedCookieName="my-app-tab"
            onChange={(event) => {
                console.log(
                    "Selection changed:",
                    tabs[event.selectedIndex].label
                );
            }}
        />
    );
}
```

> Last selected tab persists across page refreshes.

### 8. Cookie Persistence - Full

Save both tabs and selection to cookies.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function FullCookiePersistenceExample() {
    const initialTabs = [
        { key: "tab1", label: "Tab 1" },
        { key: "tab2", label: "Tab 2" },
        { key: "tab3", label: "Tab 3" },
        { key: "tab4", label: "Tab 4" },
    ];

    return (
        <ChipTabs
            tabs={initialTabs}
            selectedCookieName="app-selected"
            tabsCookieName="app-tabs"
            showCloseButton={true}
            draggable={true}
            wrap={false}
            onClose={(key) => {
                return window.confirm(`Close "${key}" tab?`);
            }}
        />
    );
}
```

> Tab state (close/reorder) persists across page refreshes.

### 9. Custom Styling

Apply fully customized styles.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function CustomStyledExample() {
    const tabs = [
        { key: "tab1", label: "Tab 1" },
        { key: "tab2", label: "Tab 2" },
        { key: "tab3", label: "Tab 3" },
    ];

    return (
        <ChipTabs
            tabs={tabs}
            defaultSelected="tab1"
            styles={{
                height: "48px",
                fontSize: "16px",
                borderRadius: "24px",
                borderWidth: "2px",
                paddingX: "24px",
                paddingY: "8px",
                gap: "12px",
                selectedTab: {
                    backgroundColor: "#8b5cf6",
                    textColor: "#ffffff",
                    borderColor: "#8b5cf6",
                    fontWeight: 600,
                },
                defaultTab: {
                    backgroundColor: "#ffffff",
                    textColor: "#6b7280",
                    borderColor: "#e5e7eb",
                },
                hoverTab: {
                    backgroundColor: "#f3f4f6",
                    borderColor: "#d1d5db",
                    textColor: "#374151",
                },
                closeButton: {
                    size: "18px",
                    hoverBgColor: "#fce7f3",
                },
                closeButtonSelected: {
                    size: "18px",
                    hoverBgColor: "#fce7f3",
                },
            }}
        />
    );
}
```

### 10. Combined Example

Real-world example using multiple features together.

```tsx
import { useState } from "react";
import {
    ChipTabs,
    type ChipTabProps,
    type ChangeEvent,
    type ReorderEvent,
} from "@ehfuse/chip-tabs";

function AdvancedExample() {
    const [tabs, setTabs] = useState<ChipTabProps[]>([
        { key: "overview", label: "Overview", hideCloseButton: true },
        { key: "details", label: "Details" },
        { key: "settings", label: "Settings" },
        { key: "logs", label: "Logs" },
    ]);
    const [selected, setSelected] = useState("overview");

    const handleChange = (event: ChangeEvent) => {
        const newSelected = tabs[event.selectedIndex].key;
        setSelected(newSelected);
        console.log(
            `Tab changed: ${tabs[event.previousIndex].key} → ${newSelected}`
        );
    };

    const handleClose = async (key: string) => {
        // Async confirmation dialog
        const confirmed = await new Promise<boolean>((resolve) => {
            const result = window.confirm(`Close "${key}" tab?`);
            setTimeout(() => resolve(result), 100);
        });

        if (confirmed) {
            const newTabs = tabs.filter((tab) => tab.key !== key);
            setTabs(newTabs);

            // Handle closing current selection
            if (key === selected && newTabs.length > 0) {
                setSelected(newTabs[0].key);
            }
        }

        return confirmed;
    };

    const handleReorder = (event: ReorderEvent) => {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(event.fromIndex, 1);
        newTabs.splice(event.toIndex, 0, movedTab);
        setTabs(newTabs);
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <ChipTabs
                tabs={tabs}
                selectedKey={selected}
                wrap={false}
                showCloseButton={true}
                draggable={true}
                selectedCookieName="advanced-example-selected"
                tabsCookieName="advanced-example-tabs"
                onChange={handleChange}
                onClose={handleClose}
                onReorder={handleReorder}
                styles={{
                    height: "42px",
                    fontSize: "14px",
                    borderRadius: "21px",
                    gap: "8px",
                    selectedTab: {
                        backgroundColor: "#3b82f6",
                        textColor: "#ffffff",
                        borderColor: "#3b82f6",
                    },
                }}
            />

            <div
                style={{
                    marginTop: "24px",
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                }}
            >
                <h3>Current State</h3>
                <p>
                    Selected: <strong>{selected}</strong>
                </p>
                <p>
                    Total tabs: <strong>{tabs.length}</strong>
                </p>
            </div>
        </div>
    );
}
```

## Practical Tips

### Tab Count Limit

Prevent users from closing all tabs:

```tsx
const handleClose = (key: string) => {
    if (tabs.length <= 1) {
        alert("Must keep at least one tab.");
        return false;
    }
    // ... rest of logic
};
```

### Dynamic Tab Addition

```tsx
const addTab = () => {
    const newTab = {
        key: `tab-${Date.now()}`,
        label: `New Tab ${tabs.length + 1}`,
    };
    setTabs([...tabs, newTab]);
    setSelected(newTab.key);
};
```

### Tab Data Integration

```tsx
const handleChange = (event: ChangeEvent) => {
    const selectedTab = tabs[event.selectedIndex];
    setSelected(selectedTab.key);

    // API call or data loading
    fetchDataForTab(selectedTab.key);
};
```

### Conditional Tab Display

```tsx
const tabs = [
    { key: "public", label: "Public" },
    isAdmin && { key: "admin", label: "Admin" },
    isPremium && { key: "premium", label: "Premium" },
].filter(Boolean) as ChipTabProps[];
```

## More Examples

Check the `example` folder in the project for runnable examples:

```bash
cd example
npm install
npm run dev
```

---

## Related Documentation

| 📚 Documentation                        | Description                     |
| --------------------------------------- | ------------------------------- |
| [Getting Started](./getting-started.md) | Installation and basic usage    |
| [API Reference](./api.md)               | Props, events, type definitions |
| **Examples**                            | Practical examples              |
