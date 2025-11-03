# 예제

## 목차

### 기본 예제

-   [1. 간단한 탭](#1-간단한-탭)
-   [2. 제어 컴포넌트](#2-제어-컴포넌트)

### 고급 예제

-   [3. 닫을 수 있는 탭](#3-닫을-수-있는-탭)
-   [4. 드래그 앤 드롭](#4-드래그-앤-드롭)
-   [5. 아이콘이 있는 탭](#5-아이콘이-있는-탭)
-   [6. 스크롤 모드](#6-스크롤-모드)
-   [7. 쿠키 저장 - 선택만](#7-쿠키-저장---선택만)
-   [8. 쿠키 저장 - 전체](#8-쿠키-저장---전체)
-   [9. 커스텀 스타일](#9-커스텀-스타일)
-   [10. 복합 예제](#10-복합-예제)

### 실전 팁

-   [탭 개수 제한](#탭-개수-제한)
-   [동적 탭 추가](#동적-탭-추가)
-   [탭 데이터 연동](#탭-데이터-연동)
-   [조건부 탭 표시](#조건부-탭-표시)

---

## 기본 예제

### 1. 간단한 탭

가장 기본적인 사용법입니다.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function BasicExample() {
    const tabs = [
        { key: "home", label: "홈" },
        { key: "products", label: "제품" },
        { key: "about", label: "소개" },
    ];

    return <ChipTabs tabs={tabs} defaultSelected="home" />;
}
```

### 2. 제어 컴포넌트

상태를 직접 관리하는 방식입니다.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function ControlledExample() {
    const [selected, setSelected] = useState("tab1");
    const tabs = [
        { key: "tab1", label: "탭 1" },
        { key: "tab2", label: "탭 2" },
        { key: "tab3", label: "탭 3" },
    ];

    return (
        <div>
            <ChipTabs
                tabs={tabs}
                selectedKey={selected}
                onChange={(event) => setSelected(tabs[event.selectedIndex].key)}
            />
            <div>현재 선택: {selected}</div>
        </div>
    );
}
```

## 고급 예제

### 3. 닫을 수 있는 탭

확인 다이얼로그와 함께 탭을 닫을 수 있습니다.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function CloseableTabsExample() {
    const [tabs, setTabs] = useState([
        { key: "tab1", label: "탭 1" },
        { key: "tab2", label: "탭 2" },
        { key: "tab3", label: "탭 3" },
    ]);
    const [selected, setSelected] = useState("tab1");

    const handleClose = (key: string) => {
        const confirmed = window.confirm(`"${key}" 탭을 닫으시겠습니까?`);
        if (confirmed) {
            setTabs(tabs.filter((tab) => tab.key !== key));

            // 현재 선택된 탭을 닫는 경우 첫 번째 탭으로 이동
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

### 4. 드래그 앤 드롭

탭 순서를 드래그로 변경할 수 있습니다.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function DraggableTabsExample() {
    const [tabs, setTabs] = useState([
        { key: "tab1", label: "탭 1" },
        { key: "tab2", label: "탭 2" },
        { key: "tab3", label: "탭 3" },
        { key: "tab4", label: "탭 4" },
    ]);

    const handleReorder = (event: ReorderEvent) => {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(event.fromIndex, 1);
        newTabs.splice(event.toIndex, 0, movedTab);
        setTabs(newTabs);

        console.log(`탭 이동: ${event.fromIndex} → ${event.toIndex}`);
    };

    return <ChipTabs tabs={tabs} draggable={true} onReorder={handleReorder} />;
}
```

### 5. 아이콘이 있는 탭

각 탭에 아이콘을 추가할 수 있습니다.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";
import { HomeIcon, UserIcon, SettingsIcon } from "./icons";

function IconTabsExample() {
    const tabs = [
        {
            key: "home",
            label: "홈",
            icon: <HomeIcon />,
        },
        {
            key: "profile",
            label: "프로필",
            icon: <UserIcon />,
        },
        {
            key: "settings",
            label: "설정",
            icon: <SettingsIcon />,
        },
    ];

    return <ChipTabs tabs={tabs} defaultSelected="home" />;
}
```

### 6. 스크롤 모드

좁은 공간에서 많은 탭을 표시할 때 유용합니다.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function ScrollModeExample() {
    const tabs = Array.from({ length: 20 }, (_, i) => ({
        key: `tab${i + 1}`,
        label: `탭 ${i + 1}`,
    }));

    return (
        <div style={{ maxWidth: "600px" }}>
            <ChipTabs tabs={tabs} wrap={false} defaultSelected="tab1" />
        </div>
    );
}
```

### 7. 쿠키 저장 - 선택만

선택된 탭만 쿠키에 저장합니다.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function CookieSelectionExample() {
    const tabs = [
        { key: "dashboard", label: "대시보드" },
        { key: "analytics", label: "분석" },
        { key: "reports", label: "리포트" },
    ];

    return (
        <ChipTabs
            tabs={tabs}
            selectedCookieName="my-app-tab"
            onChange={(event) => {
                console.log("선택 변경:", tabs[event.selectedIndex].label);
            }}
        />
    );
}
```

> 페이지를 새로고침해도 마지막에 선택한 탭이 유지됩니다.

### 8. 쿠키 저장 - 전체

탭 목록과 선택 모두 쿠키에 저장합니다.

```tsx
import { useState } from "react";
import { ChipTabs } from "@ehfuse/chip-tabs";

function FullCookiePersistenceExample() {
    const initialTabs = [
        { key: "tab1", label: "탭 1" },
        { key: "tab2", label: "탭 2" },
        { key: "tab3", label: "탭 3" },
        { key: "tab4", label: "탭 4" },
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
                return window.confirm(`"${key}" 탭을 닫으시겠습니까?`);
            }}
        />
    );
}
```

> 탭을 닫거나 순서를 변경한 후 페이지를 새로고침해도 상태가 유지됩니다.

### 9. 커스텀 스타일

완전히 커스터마이징된 스타일을 적용할 수 있습니다.

```tsx
import { ChipTabs } from "@ehfuse/chip-tabs";

function CustomStyledExample() {
    const tabs = [
        { key: "tab1", label: "탭 1" },
        { key: "tab2", label: "탭 2" },
        { key: "tab3", label: "탭 3" },
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

### 10. 복합 예제

여러 기능을 함께 사용하는 실전 예제입니다.

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
        { key: "overview", label: "개요", hideCloseButton: true },
        { key: "details", label: "상세정보" },
        { key: "settings", label: "설정" },
        { key: "logs", label: "로그" },
    ]);
    const [selected, setSelected] = useState("overview");

    const handleChange = (event: ChangeEvent) => {
        const newSelected = tabs[event.selectedIndex].key;
        setSelected(newSelected);
        console.log(
            `탭 변경: ${tabs[event.previousIndex].key} → ${newSelected}`
        );
    };

    const handleClose = async (key: string) => {
        // 비동기 확인 다이얼로그
        const confirmed = await new Promise<boolean>((resolve) => {
            const result = window.confirm(`"${key}" 탭을 닫으시겠습니까?`);
            setTimeout(() => resolve(result), 100);
        });

        if (confirmed) {
            const newTabs = tabs.filter((tab) => tab.key !== key);
            setTabs(newTabs);

            // 현재 선택된 탭을 닫는 경우
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
                <h3>현재 상태</h3>
                <p>
                    선택된 탭: <strong>{selected}</strong>
                </p>
                <p>
                    총 탭 수: <strong>{tabs.length}</strong>
                </p>
            </div>
        </div>
    );
}
```

## 실전 팁

### 탭 개수 제한

사용자가 모든 탭을 닫지 못하도록 방지:

```tsx
const handleClose = (key: string) => {
    if (tabs.length <= 1) {
        alert("최소 하나의 탭은 유지해야 합니다.");
        return false;
    }
    // ... 나머지 로직
};
```

### 동적 탭 추가

```tsx
const addTab = () => {
    const newTab = {
        key: `tab-${Date.now()}`,
        label: `새 탭 ${tabs.length + 1}`,
    };
    setTabs([...tabs, newTab]);
    setSelected(newTab.key);
};
```

### 탭 데이터 연동

```tsx
const handleChange = (event: ChangeEvent) => {
    const selectedTab = tabs[event.selectedIndex];
    setSelected(selectedTab.key);

    // API 호출이나 데이터 로딩
    fetchDataForTab(selectedTab.key);
};
```

### 조건부 탭 표시

```tsx
const tabs = [
    { key: "public", label: "공개" },
    isAdmin && { key: "admin", label: "관리자" },
    isPremium && { key: "premium", label: "프리미엄" },
].filter(Boolean) as ChipTabProps[];
```

---

## 관련 문서

| 📚 문서                          | 설명                     |
| -------------------------------- | ------------------------ |
| [시작하기](./getting-started.md) | 설치 및 기본 사용법      |
| [API 레퍼런스](./api.md)         | Props, 이벤트, 타입 정의 |
| **예제**                         | 실전 예제 모음           |
