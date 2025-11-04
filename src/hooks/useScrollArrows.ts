import { useEffect, useRef, useState } from "react";

export const useScrollArrows = (
    wrap: boolean,
    showArrows: boolean,
    tagItems: any[]
) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const shouldShowArrows = !wrap && showArrows !== false;

    // 스크롤 화살표 표시 여부 업데이트
    const updateScrollArrows = () => {
        if (!scrollContainerRef.current || wrap || !shouldShowArrows) return;

        const { scrollLeft, scrollWidth, clientWidth } =
            scrollContainerRef.current;

        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    };

    // 스크롤 이벤트 리스너 등록
    useEffect(() => {
        if (!wrap) {
            updateScrollArrows();
            const container = scrollContainerRef.current;
            if (container) {
                container.addEventListener("scroll", updateScrollArrows);
                window.addEventListener("resize", updateScrollArrows);
                return () => {
                    container.removeEventListener("scroll", updateScrollArrows);
                    window.removeEventListener("resize", updateScrollArrows);
                };
            }
        }
    }, [wrap, tagItems]);

    // 스크롤 함수 (탭 크기만큼 정확하게 이동)
    const scrollToDirection = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const currentScrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;

        // 현재 보이는 영역에서 탭 요소들 찾기
        const tabElements = Array.from(
            container.querySelectorAll("[data-selected]")
        ) as HTMLElement[];

        if (tabElements.length === 0) return;

        // 내부 컨테이너의 padding 및 gap 값 가져오기
        const innerContainer = container.querySelector("div") as HTMLElement;
        const computedStyle = innerContainer
            ? getComputedStyle(innerContainer)
            : null;
        const paddingLeft = computedStyle
            ? parseFloat(computedStyle.paddingLeft) || 0
            : 0;
        const paddingRight =
            shouldShowArrows && computedStyle
                ? parseFloat(computedStyle.paddingRight) || 0
                : 0;

        if (direction === "right") {
            // 오른쪽: 현재 뷰포트 왼쪽 끝에서 완전히 보이는 첫 번째 탭의 다음 탭으로 스크롤
            const viewportLeft = currentScrollLeft + paddingLeft;

            for (let i = 0; i < tabElements.length; i++) {
                const tab = tabElements[i];
                const tabLeft = tab.offsetLeft;
                const tabRight = tabLeft + tab.offsetWidth;

                // 현재 뷰포트 왼쪽에 완전히 보이는 탭 찾기
                if (
                    tabLeft >= viewportLeft - 1 &&
                    tabRight <=
                        currentScrollLeft + containerWidth - paddingRight + 1
                ) {
                    // 다음 탭이 있으면 그 탭으로 스크롤 (offsetLeft는 이미 gap을 포함)
                    if (i + 1 < tabElements.length) {
                        const nextTab = tabElements[i + 1];
                        container.scrollTo({
                            left: nextTab.offsetLeft - paddingLeft,
                            behavior: "smooth",
                        });
                        return;
                    }
                }
            }

            // 마지막까지 스크롤
            container.scrollTo({
                left: container.scrollWidth - containerWidth,
                behavior: "smooth",
            });
        } else {
            // 왼쪽: 현재 보이는 영역의 왼쪽 끝 너머에 있는 마지막 탭 찾기
            const viewportLeft = currentScrollLeft + paddingLeft;

            for (let i = tabElements.length - 1; i >= 0; i--) {
                const tab = tabElements[i];
                const tabLeft = tab.offsetLeft;

                // 탭이 현재 뷰포트 왼쪽 끝보다 왼쪽에 있으면 그 탭으로 스크롤 (offsetLeft는 이미 gap을 포함)
                if (tabLeft < viewportLeft - 1) {
                    container.scrollTo({
                        left: tabLeft - paddingLeft,
                        behavior: "smooth",
                    });
                    return;
                }
            }

            // 처음으로 스크롤
            container.scrollTo({
                left: 0,
                behavior: "smooth",
            });
        }
    };

    return {
        scrollContainerRef,
        showLeftArrow,
        showRightArrow,
        shouldShowArrows,
        scrollToDirection,
    };
};
