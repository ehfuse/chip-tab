import { useRef } from "react";
import type { ChipTabProps } from "../types";

interface UseTabNavigationProps {
    scrollContainerRef: React.RefObject<HTMLDivElement>;
    wrap: boolean;
    keyboardNavigation: boolean;
    tabs: ChipTabProps[];
    selectedTag: string;
    setSelectedTag: (key: string) => void;
    onChange?: (data: { selectedIndex: number; previousIndex: number }) => void;
}

export const useTabNavigation = ({
    scrollContainerRef,
    wrap,
    keyboardNavigation,
    tabs,
    selectedTag,
    setSelectedTag,
    onChange,
}: UseTabNavigationProps) => {
    // 버튼 레퍼런스 관리 (스크롤을 위해 필요)
    const buttonRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

    // ref 연결 콜백 함수
    const setButtonRef = (element: HTMLDivElement | null, key: string) => {
        if (element) {
            buttonRefs.current.set(key, element);
        }
    };

    // 선택된 탭으로 스크롤
    const scrollToTab = (tabKey: string) => {
        if (!scrollContainerRef.current || wrap) return;

        const tabElement = buttonRefs.current.get(tabKey);
        if (!tabElement) return;

        const container = scrollContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();

        // gap 값을 파싱 (px 단위)
        const computedStyle = window.getComputedStyle(
            container.firstElementChild as Element
        );
        const gapValue = parseFloat(computedStyle.gap) || 0;

        const margin = 20 + gapValue * 2; // 좌우 여백 + gap x 2

        // 탭이 컨테이너의 왼쪽 영역을 벗어났는지 확인
        if (tabRect.left < containerRect.left + margin) {
            const scrollOffset = tabRect.left - containerRect.left - margin;
            container.scrollTo({
                left: container.scrollLeft + scrollOffset,
                behavior: "smooth",
            });
        }
        // 탭이 컨테이너의 오른쪽 영역을 벗어났는지 확인
        else if (tabRect.right > containerRect.right - margin) {
            const scrollOffset = tabRect.right - containerRect.right + margin;
            container.scrollTo({
                left: container.scrollLeft + scrollOffset,
                behavior: "smooth",
            });
        }
    };

    // 방향키로 탭 이동
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!keyboardNavigation) return;
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

        e.preventDefault();
        const currentIndex = tabs.findIndex((tab) => tab.key === selectedTag);

        if (e.key === "ArrowLeft" && currentIndex > 0) {
            // 왼쪽 화살표: 이전 탭으로
            const newKey = tabs[currentIndex - 1].key;
            setSelectedTag(newKey);

            // 탭으로 스크롤
            setTimeout(() => scrollToTab(newKey), 0);

            if (onChange) {
                onChange({
                    selectedIndex: currentIndex - 1,
                    previousIndex: currentIndex,
                });
            }
        } else if (e.key === "ArrowRight" && currentIndex < tabs.length - 1) {
            // 오른쪽 화살표: 다음 탭으로
            const newKey = tabs[currentIndex + 1].key;
            setSelectedTag(newKey);

            // 탭으로 스크롤
            setTimeout(() => scrollToTab(newKey), 0);

            if (onChange) {
                onChange({
                    selectedIndex: currentIndex + 1,
                    previousIndex: currentIndex,
                });
            }
        }
    };

    return {
        buttonRefs,
        setButtonRef,
        scrollToTab,
        handleKeyDown,
    };
};
