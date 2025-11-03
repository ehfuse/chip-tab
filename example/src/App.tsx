import { useState } from "react";
import { ChipTabs } from "../../src/ChipTabs";
import type { ChipTabProps } from "../../src/types";
import "./App.css";

function App() {
    // Basic Tabs
    const [basicTabs] = useState<ChipTabProps[]>([
        { key: "all", label: "All" },
        { key: "trending", label: "Trending" },
        { key: "new", label: "New" },
        { key: "featured", label: "Featured" },
        { key: "popular", label: "Popular" },
        { key: "recommended", label: "Recommended" },
        { key: "favorites", label: "Favorites" },
        { key: "recent", label: "Recent" },
        { key: "top-rated", label: "Top Rated" },
        { key: "most-viewed", label: "Most Viewed" },
        { key: "editors-choice", label: "Editor's Choice" },
        { key: "best-sellers", label: "Best Sellers" },
        { key: "new-releases", label: "New Releases" },
        { key: "coming-soon", label: "Coming Soon" },
        { key: "on-sale", label: "On Sale" },
        { key: "limited-edition", label: "Limited Edition" },
        { key: "exclusive", label: "Exclusive" },
        { key: "bundle-deals", label: "Bundle Deals" },
        { key: "pre-order", label: "Pre-Order" },
        { key: "clearance", label: "Clearance" },
    ]);
    const [basicSelected, setBasicSelected] = useState<string>("all");

    // Tabs with Close Buttons
    const [closeableTabs, setCloseableTabs] = useState<ChipTabProps[]>([
        { key: "home", label: "Home", hideCloseButton: true },
        { key: "workspace", label: "Workspace" },
        { key: "projects", label: "Projects" },
        { key: "tasks", label: "Tasks" },
        { key: "calendar", label: "Calendar" },
        { key: "messages", label: "Messages" },
        { key: "notifications", label: "Notifications" },
        { key: "settings", label: "Settings" },
        { key: "profile", label: "Profile" },
        { key: "help", label: "Help" },
    ]);
    const [closeableSelected, setCloseableSelected] = useState<string>("home");

    // Scroll Mode Tabs
    const [scrollTabs] = useState<ChipTabProps[]>([
        { key: "javascript", label: "JavaScript" },
        { key: "typescript", label: "TypeScript" },
        { key: "react", label: "React" },
        { key: "vue", label: "Vue.js" },
        { key: "angular", label: "Angular" },
        { key: "svelte", label: "Svelte" },
        { key: "nextjs", label: "Next.js" },
        { key: "nuxtjs", label: "Nuxt.js" },
        { key: "gatsby", label: "Gatsby" },
        { key: "remix", label: "Remix" },
        { key: "astro", label: "Astro" },
        { key: "solid", label: "Solid.js" },
    ]);
    const [scrollSelected, setScrollSelected] = useState<string>("javascript");

    // Scroll Mode with Close Buttons
    const [scrollCloseableTabs, setScrollCloseableTabs] = useState<
        ChipTabProps[]
    >([
        { key: "tab1", label: "Overview" },
        { key: "tab2", label: "User Management System" },
        { key: "tab3", label: "Reports" },
        { key: "tab4", label: "Financial Dashboard Q4 2024" },
        { key: "tab5", label: "Settings" },
        { key: "tab6", label: "API Documentation v2.3.1" },
        { key: "tab7", label: "Logs" },
        { key: "tab8", label: "Performance Metrics & Analytics" },
        { key: "tab9", label: "Database Schema" },
        { key: "tab10", label: "Marketing Campaign Results" },
        { key: "tab11", label: "Security Audit Report 2024" },
        { key: "tab12", label: "Notifications" },
    ]);
    const [scrollCloseableSelected, setScrollCloseableSelected] =
        useState<string>("tab1"); // Draggable Tabs
    const [draggableTabs, setDraggableTabs] = useState<ChipTabProps[]>([
        { key: "intro", label: "Introduction" },
        { key: "getting-started", label: "Getting Started" },
        { key: "installation", label: "Installation" },
        { key: "configuration", label: "Configuration" },
        { key: "usage", label: "Usage" },
        { key: "api", label: "API Reference" },
        { key: "examples", label: "Examples" },
        { key: "faq", label: "FAQ" },
    ]);
    const [draggableSelected, setDraggableSelected] = useState<string>("intro");

    const handleCloseableTabClose = (key: string): boolean => {
        // 확인 메시지 표시
        const confirmed = window.confirm(
            `Are you sure you want to close "${
                closeableTabs.find((t) => t.key === key)?.label
            }"?`
        );

        if (!confirmed) {
            return false; // 취소하면 false 반환
        }

        // 삭제할 탭의 인덱스 찾기
        const tabToDeleteIndex = closeableTabs.findIndex(
            (tab) => tab.key === key
        );

        // 탭 삭제
        setCloseableTabs((prevTabs) =>
            prevTabs.filter((tab) => tab.key !== key)
        );

        // 삭제된 탭이 현재 선택된 탭이면 새로운 탭 선택
        if (closeableSelected === key && closeableTabs.length > 1) {
            const remainingTabs = closeableTabs.filter(
                (tab) => tab.key !== key
            );

            if (remainingTabs.length > 0) {
                // 삭제된 탭의 이전 탭을 선택 (첫 번째 탭이면 다음 탭 선택)
                let newSelectedIndex;
                if (tabToDeleteIndex > 0) {
                    // 이전 탭이 있으면 이전 탭 선택
                    newSelectedIndex = tabToDeleteIndex - 1;
                } else {
                    // 첫 번째 탭이면 다음 탭(인덱스 0) 선택
                    newSelectedIndex = 0;
                }

                // 인덱스가 범위를 벗어나지 않도록 조정
                if (newSelectedIndex >= remainingTabs.length) {
                    newSelectedIndex = remainingTabs.length - 1;
                }

                setCloseableSelected(remainingTabs[newSelectedIndex].key);
            }
        }
        return true; // 성공적으로 제거
    };

    const handleAddTab = () => {
        const tabNames = [
            "Analytics",
            "Dashboard",
            "Reports",
            "Users",
            "Documents",
            "Settings",
            "Logs",
            "Security",
            "API Keys",
            "Billing",
            "Support",
            "Feedback",
            "Themes",
            "Integrations",
            "Plugins",
            "Archive",
            "Trash",
            "Downloads",
            "Uploads",
            "Statistics",
        ];

        // 현재 탭에 없는 이름 찾기
        const existingLabels = closeableTabs.map((tab) => tab.label);
        const availableNames = tabNames.filter(
            (name) => !existingLabels.includes(name)
        );

        if (availableNames.length === 0) {
            // 사용 가능한 이름이 없으면 번호로 생성
            const newTabNumber = closeableTabs.length + 1;
            const newKey = `new-tab-${Date.now()}`;
            const newTab = {
                key: newKey,
                label: `New Tab ${newTabNumber}`,
            };

            setCloseableTabs((prev) => [...prev, newTab]);
            setCloseableSelected(newKey);
        } else {
            // 랜덤하게 이름 선택
            const randomName =
                availableNames[
                    Math.floor(Math.random() * availableNames.length)
                ];
            const newKey = `tab-${randomName
                .toLowerCase()
                .replace(/\s+/g, "-")}-${Date.now()}`;
            const newTab = {
                key: newKey,
                label: randomName,
            };

            setCloseableTabs((prev) => [...prev, newTab]);
            setCloseableSelected(newKey);
        }
    };

    const addScrollCloseableTab = () => {
        const tabCount = scrollCloseableTabs.length;
        const newKey = `tab${tabCount + 1}`;
        const newTab: ChipTabProps = {
            key: newKey,
            label: `New Tab ${tabCount + 1}`,
        };

        setScrollCloseableTabs((prev) => [...prev, newTab]);
        setScrollCloseableSelected(newKey);
    };

    const handleScrollCloseableTabClose = (key: string): boolean => {
        // 삭제할 탭의 인덱스 찾기
        const tabToDeleteIndex = scrollCloseableTabs.findIndex(
            (tab) => tab.key === key
        );

        // 탭 삭제
        setScrollCloseableTabs((prevTabs) =>
            prevTabs.filter((tab) => tab.key !== key)
        );

        // 삭제된 탭이 현재 선택된 탭이면 새로운 탭 선택
        if (scrollCloseableSelected === key && scrollCloseableTabs.length > 1) {
            const remainingTabs = scrollCloseableTabs.filter(
                (tab) => tab.key !== key
            );

            if (remainingTabs.length > 0) {
                // 삭제된 탭의 이전 탭을 선택 (첫 번째 탭이면 다음 탭 선택)
                let newSelectedIndex;
                if (tabToDeleteIndex > 0) {
                    // 이전 탭이 있으면 이전 탭 선택
                    newSelectedIndex = tabToDeleteIndex - 1;
                } else {
                    // 첫 번째 탭이면 다음 탭(인덱스 0) 선택
                    newSelectedIndex = 0;
                }

                // 인덱스가 범위를 벗어나지 않도록 조정
                if (newSelectedIndex >= remainingTabs.length) {
                    newSelectedIndex = remainingTabs.length - 1;
                }

                setScrollCloseableSelected(remainingTabs[newSelectedIndex].key);
            }
        }
        return true; // 항상 제거 허용
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
            <h1>ChipTab Component Demo</h1>

            <div style={{ marginBottom: "3rem" }}>
                <h2>Basic Tabs (Wrap Mode)</h2>
                <ChipTabs
                    tabs={basicTabs}
                    selectedKey={basicSelected}
                    onChange={(event) => {
                        console.log(
                            `Changed: ${
                                basicTabs[event.previousIndex]?.label
                            } (${event.previousIndex}) → ${
                                basicTabs[event.selectedIndex].label
                            } (${event.selectedIndex})`
                        );
                        setBasicSelected(basicTabs[event.selectedIndex].key);
                    }}
                />
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "0.25rem",
                    }}
                >
                    Selected: <strong>{basicSelected}</strong>
                </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2>With Close Buttons</h2>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <ChipTabs
                        tabs={closeableTabs}
                        selectedKey={closeableSelected}
                        showCloseButton={true}
                        onChange={(event) =>
                            setCloseableSelected(
                                closeableTabs[event.selectedIndex].key
                            )
                        }
                        onClose={handleCloseableTabClose}
                    />
                    <button
                        onClick={handleAddTab}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            transition: "background-color 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2563eb")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#3b82f6")
                        }
                    >
                        + Add Tab
                    </button>
                </div>
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "0.25rem",
                    }}
                >
                    Selected: <strong>{closeableSelected}</strong> | Total:{" "}
                    {closeableTabs.length} tabs
                </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2>Scroll Mode (No Wrap)</h2>
                <div
                    style={{
                        maxWidth: "600px",
                        border: "1px solid #e5e7eb",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    <ChipTabs
                        tabs={scrollTabs}
                        selectedKey={scrollSelected}
                        wrap={false}
                        onChange={(event) =>
                            setScrollSelected(
                                scrollTabs[event.selectedIndex].key
                            )
                        }
                    />
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "0.25rem",
                        }}
                    >
                        Selected: <strong>{scrollSelected}</strong>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2>Scroll Mode with Close Buttons (Save Selection Only)</h2>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                    Only selected tab is saved to cookie (refresh to test)
                </p>
                <div
                    style={{
                        maxWidth: "600px",
                        border: "1px solid #e5e7eb",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    <ChipTabs
                        tabs={scrollCloseableTabs}
                        selectedKey={scrollCloseableSelected}
                        wrap={false}
                        showCloseButton={true}
                        selectedCookieName="chip-tab-selected"
                        onChange={(event) =>
                            setScrollCloseableSelected(
                                scrollCloseableTabs[event.selectedIndex].key
                            )
                        }
                        onClose={handleScrollCloseableTabClose}
                    />
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "0.25rem",
                        }}
                    >
                        Selected: <strong>{scrollCloseableSelected}</strong> |
                        Total: {scrollCloseableTabs.length} tabs
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2>Scroll Mode with Full Cookie Persistence</h2>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                    Both tabs and selection are saved to cookies (close tabs and
                    refresh to test)
                </p>
                <div
                    style={{
                        maxWidth: "600px",
                        border: "1px solid #e5e7eb",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    <ChipTabs
                        tabs={scrollCloseableTabs}
                        selectedKey={scrollCloseableSelected}
                        wrap={false}
                        showCloseButton={true}
                        selectedCookieName="chip-tab-selected-full"
                        tabsCookieName="chip-tab-tabs-full"
                        onChange={(event) =>
                            setScrollCloseableSelected(
                                scrollCloseableTabs[event.selectedIndex].key
                            )
                        }
                        onLoaded={(cookieTabs, cookieSelectedKey) => {
                            console.log("Loaded from cookies:", {
                                cookieTabs,
                                cookieSelectedKey,
                            });
                            setScrollCloseableTabs(cookieTabs);
                            setScrollCloseableSelected(cookieSelectedKey);
                        }}
                        onClose={handleScrollCloseableTabClose}
                    />
                    <button
                        onClick={addScrollCloseableTab}
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem 1rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#2563eb";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#3b82f6";
                        }}
                    >
                        + Add Tab
                    </button>
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "0.25rem",
                        }}
                    >
                        Selected: <strong>{scrollCloseableSelected}</strong> |
                        Total: {scrollCloseableTabs.length} tabs
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2>Draggable Tabs</h2>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                    Drag tabs to reorder them
                </p>
                <div
                    style={{
                        maxWidth: "800px",
                        border: "1px solid #e5e7eb",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    <ChipTabs
                        tabs={draggableTabs}
                        selectedKey={draggableSelected}
                        wrap={false}
                        draggable={true}
                        onChange={(event) =>
                            setDraggableSelected(
                                draggableTabs[event.selectedIndex].key
                            )
                        }
                        onReorder={(event) => {
                            console.log(
                                `Reordered: ${event.fromIndex} → ${event.toIndex}`
                            );
                            // 사용자가 직접 tabs 상태를 업데이트해야 함
                            const newTabs = [...draggableTabs];
                            const [moved] = newTabs.splice(event.fromIndex, 1);
                            newTabs.splice(event.toIndex, 0, moved);
                            setDraggableTabs(newTabs);
                        }}
                    />
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "0.25rem",
                        }}
                    >
                        Selected: <strong>{draggableSelected}</strong>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                                marginTop: "0.5rem",
                            }}
                        >
                            Current order:{" "}
                            {draggableTabs.map((t) => t.label).join(" → ")}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2>Custom Styled Tabs</h2>
                <ChipTabs
                    tabs={basicTabs.slice(0, 10)}
                    selectedKey={basicSelected}
                    onChange={(event) =>
                        setBasicSelected(basicTabs[event.selectedIndex].key)
                    }
                    styles={{
                        height: "2.5rem",
                        fontSize: "1rem",
                        borderRadius: "0.5rem",
                        borderWidth: "2px",
                        paddingX: "1.5rem",
                        paddingY: "0.5rem",
                        gap: "1rem",
                        defaultTab: {
                            borderColor: "#e0e7ff",
                            backgroundColor: "#f5f3ff",
                            textColor: "#6366f1",
                        },
                        selectedTab: {
                            borderColor: "#6366f1",
                            backgroundColor: "#6366f1",
                            textColor: "#ffffff",
                            fontWeight: 600,
                        },
                        hoverTab: {
                            borderColor: "#a5b4fc",
                            backgroundColor: "#eef2ff",
                        },
                    }}
                />
                <div
                    style={{
                        marginTop: "1rem",
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "0.25rem",
                    }}
                >
                    Selected: <strong>{basicSelected}</strong>
                </div>
            </div>

            <div style={{ marginBottom: "3rem" }}>
                <h2>Draggable Tabs</h2>
                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                    Drag tabs to reorder them
                </p>
                <div
                    style={{
                        maxWidth: "800px",
                        border: "1px solid #e5e7eb",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    <ChipTabs
                        tabs={draggableTabs}
                        selectedKey={draggableSelected}
                        wrap={false}
                        draggable={true}
                        onChange={(event) =>
                            setDraggableSelected(
                                draggableTabs[event.selectedIndex].key
                            )
                        }
                        onReorder={(event) => {
                            console.log(
                                `Reordered: ${event.fromIndex} → ${event.toIndex}`
                            );
                            const newTabs = [...draggableTabs];
                            const [moved] = newTabs.splice(event.fromIndex, 1);
                            newTabs.splice(event.toIndex, 0, moved);
                            setDraggableTabs(newTabs);
                        }}
                        styles={{
                            defaultTab: {
                                borderColor: "#d1d5db",
                                backgroundColor: "#f9fafb",
                                textColor: "#374151",
                            },
                            selectedTab: {
                                borderColor: "#3b82f6",
                                backgroundColor: "#3b82f6",
                                textColor: "#ffffff",
                                fontWeight: 500,
                            },
                            hoverTab: {
                                borderColor: "#93c5fd",
                                backgroundColor: "#eff6ff",
                            },
                        }}
                    />
                    <div
                        style={{
                            marginTop: "1rem",
                            padding: "0.5rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "0.25rem",
                        }}
                    >
                        Selected: <strong>{draggableSelected}</strong>
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                                marginTop: "0.5rem",
                            }}
                        >
                            Current order:{" "}
                            {draggableTabs.map((t) => t.label).join(" → ")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
