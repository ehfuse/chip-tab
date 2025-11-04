import React, { CSSProperties, useEffect, useRef, useState } from "react";
import type { ChipTabProps, ChipTabsProps } from "./types";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTab } from "./SortableTab";
import { ScrollArrow } from "./ScrollArrow";
import { getCookie, setCookie, calculateTabHeight } from "./utils";
import {
    useScrollArrows,
    useMouseDragScroll,
    useTabNavigation,
    useTabActions,
    useDragAndDrop,
} from "./hooks";

export function ChipTabs({
    tabs: tagItems,
    showCloseButton = false,
    defaultSelected = "hot",
    selectedKey,
    className = "",
    wrap = true, // 기본값은 wrap 활성화 (기존 동작 유지)
    showArrows = true, // 기본값: 화살표 표시
    draggable = false, // 기본값: 드래그 비활성화
    keyboardNavigation = true, // 기본값: 키보드 네비게이션 활성화
    styles = {},
    onChange,
    onClose,
    onLoaded,
    onReorder,
    selectedCookieName,
    tabsCookieName,
}: ChipTabsProps) {
    // 쿠키에서 초기 상태 불러오기 (첫 마운트시에만)
    const [isInitialized, setIsInitialized] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string>(
        selectedKey || defaultSelected
    );

    // tabsCookieName이 있으면 초기에는 빈 배열로 시작 (쿠키 로드 전까지)
    const [tabs, setTabs] = useState<ChipTabProps[]>(
        tabsCookieName ? [] : tagItems
    );

    // 첫 마운트시 쿠키에서 로드
    useEffect(() => {
        if (isInitialized) return;

        let cookieTabs = tagItems;
        let cookieSelectedKey = selectedKey || defaultSelected;
        let hasCookieData = false;

        // tabs 쿠키 확인
        if (tabsCookieName) {
            const savedTabs = getCookie(tabsCookieName);
            if (savedTabs) {
                try {
                    cookieTabs = JSON.parse(decodeURIComponent(savedTabs));
                    hasCookieData = true;
                } catch (e) {
                    console.warn("Failed to parse tabs cookie:", e);
                }
            }
        }

        // selectedKey 쿠키 확인
        if (selectedCookieName) {
            const savedSelection = getCookie(selectedCookieName);
            if (savedSelection) {
                cookieSelectedKey = savedSelection;
            }
        }

        // 쿠키 데이터가 없으면 props 사용, 있으면 쿠키 사용
        if (!hasCookieData && tabsCookieName) {
            // 쿠키 이름은 있지만 데이터가 없는 경우 props 사용
            cookieTabs = tagItems;
        }

        setTabs(cookieTabs);
        setSelectedTag(cookieSelectedKey);
        setIsInitialized(true);

        // onLoaded 콜백으로 쿠키에서 로드된 값들을 사용자에게 알려줌
        if (onLoaded) {
            onLoaded(cookieTabs, cookieSelectedKey);
        }
    }, []); // 빈 dependency array로 첫 마운트시에만 실행

    // 스크롤 화살표 관련 훅
    const {
        scrollContainerRef,
        showLeftArrow,
        showRightArrow,
        shouldShowArrows,
        scrollToDirection,
    } = useScrollArrows(wrap, showArrows, tagItems);

    // 마우스 드래그 스크롤 훅
    const {
        isDragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
    } = useMouseDragScroll(scrollContainerRef);

    // 탭 네비게이션 훅
    const { setButtonRef, scrollToTab, handleKeyDown } = useTabNavigation({
        scrollContainerRef,
        wrap,
        keyboardNavigation,
        tabs,
        selectedTag,
        setSelectedTag,
        onChange,
    });

    // tabs prop이 변경되면 내부 상태 업데이트하고 쿠키도 업데이트
    useEffect(() => {
        if (!isInitialized) return; // 초기화 전에는 실행하지 않음

        setTabs(tagItems);

        // 쿠키 업데이트
        if (tabsCookieName) {
            setCookie(
                tabsCookieName,
                encodeURIComponent(JSON.stringify(tagItems))
            );
        }
    }, [tagItems, isInitialized, tabsCookieName]);

    // 내부 tabs 상태가 변경되면 쿠키 저장 (사용자가 탭을 추가/삭제할 때)
    useEffect(() => {
        if (!isInitialized) return;

        if (tabsCookieName) {
            setCookie(tabsCookieName, encodeURIComponent(JSON.stringify(tabs)));
        }
    }, [tabs, tabsCookieName, isInitialized]);

    // selectedKey 쿠키에 저장
    useEffect(() => {
        if (selectedCookieName) {
            setCookie(selectedCookieName, selectedTag);
        }
    }, [selectedTag, selectedCookieName]);

    // 드래그 앤 드롭 훅
    const { sensors, handleDragEnd } = useDragAndDrop({
        tabs,
        setTabs,
        onReorder,
    });

    // selectedKey prop이 변경되면 내부 상태 업데이트하고 쿠키도 업데이트
    useEffect(() => {
        if (!isInitialized) return;

        if (selectedKey !== undefined) {
            setSelectedTag(selectedKey);

            // 쿠키 업데이트
            if (selectedCookieName) {
                setCookie(selectedCookieName, selectedKey);
            }
        }
    }, [selectedKey, isInitialized, selectedCookieName]);

    // defaultSelected prop이 변경되면 내부 상태 업데이트
    useEffect(() => {
        if (!isInitialized) return;

        if (!selectedKey && defaultSelected) {
            setSelectedTag(defaultSelected);

            // 쿠키 업데이트
            if (selectedCookieName) {
                setCookie(selectedCookieName, defaultSelected);
            }
        }
    }, [defaultSelected, selectedKey, isInitialized, selectedCookieName]);

    // 탭 액션 훅 (클릭, 닫기)
    const { handleClick, handleCloseClick } = useTabActions({
        tabs,
        tagItems,
        selectedTag,
        isDragging,
        setSelectedTag,
        setTabs,
        onChange,
        onClose,
    });

    // Hover 효과를 위한 상태 추가
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [hoveredClose, setHoveredClose] = useState<string | null>(null);

    // 기본값 설정
    const {
        height,
        fontSize = "0.875rem",
        borderRadius = "1rem",
        borderWidth = "1px",
        paddingX = "1rem",
        paddingY = "0.3rem",
        gap = "0.5rem",
        defaultTab = {},
        selectedTab = {},
        hoverTab = {},
        closeButton: closeButtonStyles = {},
        closeButtonSelected: closeButtonSelectedStyles = {},
        customStyles = {},
    } = styles;

    // 실제 탭 높이 계산
    const calculatedHeight = calculateTabHeight(
        height,
        fontSize,
        paddingY,
        borderWidth
    );

    // 각 상태별 기본값 설정
    const defaultBorderColor = defaultTab.borderColor ?? "#d1d5db";
    const defaultBackgroundColor = defaultTab.backgroundColor ?? "transparent";
    const defaultTextColor = defaultTab.textColor ?? "inherit";

    const selectedBorderColor = selectedTab.borderColor ?? "#000000";
    const selectedBackgroundColor = selectedTab.backgroundColor ?? "#000000";
    const selectedTextColor = selectedTab.textColor ?? "#ffffff";
    const selectedFontWeight = selectedTab.fontWeight ?? 500;

    const hoverBorderColor = hoverTab.borderColor ?? "#9ca3af";
    const hoverBackgroundColor = hoverTab.backgroundColor;

    const closeButtonSize = closeButtonStyles.size ?? "1.25rem";
    const closeButtonHoverBgColor = closeButtonStyles.hoverBgColor ?? "#e5e7eb";
    const closeButtonSelectedHoverBgColor =
        closeButtonSelectedStyles.hoverBgColor ?? "rgba(255, 255, 255, 0.2)";

    // 컨테이너 스타일
    const containerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap,
        minHeight: calculatedHeight, // 계산된 탭 높이로 최소 높이 유지
        ...(wrap ? { flexWrap: "wrap" } : {}),
        ...(!wrap
            ? {
                  overflowX: "auto",
                  overflowY: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  width: "100%",
                  minWidth: 0,
                  flex: "1 1 0px",
              }
            : {}),
    };

    // 내부 컨테이너 스타일
    const innerContainerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap,
        minHeight: calculatedHeight, // 계산된 탭 높이로 최소 높이 유지
        ...(wrap ? { flexWrap: "wrap" } : { flexWrap: "nowrap" }),
        ...(!wrap && shouldShowArrows
            ? {
                  minWidth: "max-content",
                  paddingLeft: "2.5rem",
                  paddingRight: "2.5rem",
              }
            : !wrap
            ? { minWidth: "max-content" }
            : {}),
    };

    // 탭 버튼 스타일 생성 함수
    const getTabStyle = (
        isSelected: boolean,
        isHovered: boolean,
        hideCloseButton?: boolean
    ): CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        borderRadius,
        border: `${borderWidth} solid`,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: showCloseButton && !hideCloseButton ? "0.5rem" : paddingX,
        fontSize,
        transition: "all 0.2s",
        flexShrink: 0,
        whiteSpace: "nowrap",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        // height는 탭 버튼에 적용하지 않음 (자연스러운 높이 사용)
        ...(isSelected
            ? {
                  borderColor: selectedBorderColor,
                  backgroundColor: selectedBackgroundColor,
                  color: selectedTextColor,
                  fontWeight: selectedFontWeight,
              }
            : {
                  borderColor: isHovered
                      ? hoverBorderColor
                      : defaultBorderColor,
                  backgroundColor:
                      isHovered && hoverBackgroundColor
                          ? hoverBackgroundColor
                          : defaultBackgroundColor,
                  color: defaultTextColor,
              }),
        ...customStyles,
    });

    // Close 버튼 컨테이너 스타일
    const getCloseButtonStyle = (
        isSelected: boolean,
        isCloseHovered: boolean,
        isTabHovered: boolean
    ): CSSProperties => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: closeButtonSize,
        height: closeButtonSize,
        borderRadius: "9999px",
        cursor: "pointer",
        padding: "1px",
        marginLeft: "0.5rem",
        transition: "all 0.3s",
        opacity: isTabHovered ? 1 : 0.3,
        transform: isTabHovered ? "scale(1)" : "scale(0.85)",
        ...(isCloseHovered
            ? isSelected
                ? { backgroundColor: closeButtonSelectedHoverBgColor }
                : { backgroundColor: closeButtonHoverBgColor }
            : { backgroundColor: "rgba(255, 255, 255, 0)" }),
    });

    const tabContent = (
        <div className="chip-tab-content" style={innerContainerStyle}>
            {tabs.map((tag: ChipTabProps) => {
                const isSelected = selectedTag === tag.key;
                const isTabHovered = hoveredTab === tag.key;
                const isCloseHovered = hoveredClose === tag.key;

                return (
                    <SortableTab
                        key={tag.key}
                        tag={tag}
                        isSelected={isSelected}
                        isTabHovered={isTabHovered}
                        isCloseHovered={isCloseHovered}
                        showCloseButton={showCloseButton}
                        tabStyle={getTabStyle(
                            isSelected,
                            isTabHovered,
                            tag.hideCloseButton
                        )}
                        closeButtonStyle={getCloseButtonStyle(
                            isSelected,
                            isCloseHovered,
                            isTabHovered
                        )}
                        onTabClick={() => handleClick(tag.key)}
                        onTabMouseEnter={() => setHoveredTab(tag.key)}
                        onTabMouseLeave={() => setHoveredTab(null)}
                        onCloseClick={(e) => handleCloseClick(e, tag.key)}
                        onCloseMouseEnter={() => setHoveredClose(tag.key)}
                        onCloseMouseLeave={() => setHoveredClose(null)}
                        setButtonRef={setButtonRef}
                        draggable={draggable}
                    />
                );
            })}
        </div>
    );

    // 최상위 컨테이너 스타일
    const chipTabsContainerStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
        minHeight: calculatedHeight,
        width: "100%",
    };

    return (
        <div className="chip-tabs-container" style={chipTabsContainerStyle}>
            {!wrap && shouldShowArrows && (
                <ScrollArrow
                    direction="left"
                    isEnabled={showLeftArrow}
                    onClick={() => scrollToDirection("left")}
                />
            )}
            <div
                ref={scrollContainerRef}
                style={{
                    ...containerStyle,
                    outline: "none",
                    minHeight: calculatedHeight, // 스크롤 컨테이너도 계산된 높이로 최소 높이 유지
                }}
                className={className}
                tabIndex={keyboardNavigation ? 0 : undefined}
                onKeyDown={keyboardNavigation ? handleKeyDown : undefined}
                onMouseDown={!wrap && !draggable ? handleMouseDown : undefined}
                onMouseMove={!wrap && !draggable ? handleMouseMove : undefined}
                onMouseUp={!wrap && !draggable ? handleMouseUp : undefined}
                onMouseLeave={
                    !wrap && !draggable ? handleMouseLeave : undefined
                }
            >
                {draggable ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToHorizontalAxis]}
                    >
                        <SortableContext
                            items={tabs.map((tab) => tab.key)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {tabContent}
                        </SortableContext>
                    </DndContext>
                ) : (
                    tabContent
                )}
            </div>
            {!wrap && shouldShowArrows && (
                <ScrollArrow
                    direction="right"
                    isEnabled={showRightArrow}
                    onClick={() => scrollToDirection("right")}
                />
            )}
        </div>
    );
}
