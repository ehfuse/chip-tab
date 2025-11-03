import React, { CSSProperties, useEffect, useRef, useState } from "react";
import type { ChipTabProps, ChipTabsProps } from "./types";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 스크롤 화살표 컴포넌트
interface ScrollArrowProps {
    direction: "left" | "right";
    isEnabled: boolean;
    onClick: () => void;
}

function ScrollArrow({ direction, isEnabled, onClick }: ScrollArrowProps) {
    const [isHovered, setIsHovered] = useState(false);

    const containerStyle: CSSProperties = {
        position: "absolute",
        top: "0",
        height: "100%",
        width: "2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        opacity: isEnabled ? 1 : 0.3,
        pointerEvents: isEnabled ? "auto" : "none",
        transition: "opacity 0.2s",
        userSelect: "none",
        ...(direction === "left" ? { left: "0" } : { right: "0" }),
        // 그라데이션 배경
        background:
            direction === "left"
                ? "linear-gradient(to right, #ffffff 0%, #ffffff 60%, rgba(255, 255, 255, 0) 100%)"
                : "linear-gradient(to left, #ffffff 0%, #ffffff 60%, rgba(255, 255, 255, 0) 100%)",
    };

    const circleButtonStyle: CSSProperties = {
        width: "2rem",
        height: "2rem",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isEnabled ? "pointer" : "default",
        transition: "background-color 0.2s",
        backgroundColor: isHovered && isEnabled ? "#f3f4f6" : "transparent",
    };

    const arrowIconStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isHovered && isEnabled ? 1 : 0.5,
        transition: "opacity 0.2s",
    };

    return (
        <div style={containerStyle}>
            <div
                style={circleButtonStyle}
                onClick={isEnabled ? onClick : undefined}
                onMouseEnter={() => isEnabled && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={arrowIconStyle}>
                    {direction === "left" ? (
                        <ChevronLeftIcon />
                    ) : (
                        <ChevronRightIcon />
                    )}
                </div>
            </div>
        </div>
    );
}

// Sortable 탭 아이템 컴포넌트
interface SortableTabProps {
    tag: ChipTabProps;
    isSelected: boolean;
    isTabHovered: boolean;
    isCloseHovered: boolean;
    showCloseButton: boolean;
    tabStyle: CSSProperties;
    closeButtonStyle: CSSProperties;
    onTabClick: () => void;
    onTabMouseEnter: () => void;
    onTabMouseLeave: () => void;
    onCloseClick: (e: React.MouseEvent) => void;
    onCloseMouseEnter: () => void;
    onCloseMouseLeave: () => void;
    setButtonRef: (el: HTMLDivElement | null, key: string) => void;
    draggable?: boolean;
}

function SortableTab({
    tag,
    isSelected,
    showCloseButton,
    tabStyle,
    closeButtonStyle,
    onTabClick,
    onTabMouseEnter,
    onTabMouseLeave,
    onCloseClick,
    onCloseMouseEnter,
    onCloseMouseLeave,
    setButtonRef,
    draggable = false,
}: SortableTabProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tag.key, disabled: !draggable });

    const style: CSSProperties = {
        ...tabStyle,
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: draggable ? "grab" : tabStyle.cursor,
    };

    return (
        <div
            ref={(el) => {
                setNodeRef(el);
                setButtonRef(el, tag.key);
            }}
            style={style}
            onClick={onTabClick}
            onMouseEnter={onTabMouseEnter}
            onMouseLeave={onTabMouseLeave}
            data-selected={isSelected ? "true" : "false"}
            {...(draggable ? { ...attributes, ...listeners } : {})}
        >
            {tag.icon && (
                <span style={{ marginRight: "0.25rem" }}>{tag.icon}</span>
            )}
            <span>{tag.label}</span>
            {showCloseButton && !tag.hideCloseButton && (
                <span
                    style={closeButtonStyle}
                    onClick={onCloseClick}
                    onMouseEnter={onCloseMouseEnter}
                    onMouseLeave={onCloseMouseLeave}
                >
                    <CloseIcon />
                </span>
            )}
        </div>
    );
}

// 쿠키 유틸리티 함수
const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

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

    // DnD 센서 설정
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px 이상 움직여야 드래그 시작
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 드래그 종료 핸들러
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const fromIndex = tabs.findIndex((tab) => tab.key === active.id);
            const toIndex = tabs.findIndex((tab) => tab.key === over.id);

            const newTabs = arrayMove(tabs, fromIndex, toIndex);

            setTabs(newTabs);

            if (onReorder) {
                onReorder({
                    fromIndex,
                    toIndex,
                });
            }
        }
    };

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

    // 스크롤 화살표 표시 여부 계산
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

    // 마우스 드래그 스크롤 핸들러
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

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
    }; // 클릭 핸들러 수정 - 선택된 태그 업데이트
    const handleClick = (key: string) => {
        if (isDragging) return; // 드래그 중일 때는 클릭 무시

        const previousIndex = tagItems.findIndex(
            (tab) => tab.key === selectedTag
        );
        const selectedIndex = tagItems.findIndex((tab) => tab.key === key);

        setSelectedTag(key);

        if (onChange) {
            onChange({ selectedIndex, previousIndex });
        }
    }; // Close 버튼 클릭 핸들러
    const handleCloseClick = async (event: React.MouseEvent, key: string) => {
        event.stopPropagation(); // 부모 클릭 이벤트 방지

        // onClose 콜백을 호출해서 삭제 허용 여부 확인
        if (onClose) {
            const result = await onClose(key);
            if (result === false) {
                return; // 삭제 취소
            }
        }

        // 삭제될 탭이 현재 선택된 탭인지 확인
        const closingIndex = tabs.findIndex((tab) => tab.key === key);
        const isSelectedTab = selectedTag === key;

        // 탭 제거
        setTabs((prevTabs) => {
            const newTabs = prevTabs.filter((tab) => tab.key !== key);

            // 삭제된 탭이 선택된 탭이었다면 이전 탭을 선택
            if (isSelectedTab && newTabs.length > 0) {
                let newSelectedIndex;

                // 항상 이전 탭을 선택 (첫 번째 탭이 삭제되면 다음 탭 선택)
                if (closingIndex > 0) {
                    // 이전 탭이 있으면 이전 탭 선택
                    newSelectedIndex = closingIndex - 1;
                } else {
                    // 첫 번째 탭이 삭제되면 새로운 첫 번째 탭(인덱스 0) 선택
                    newSelectedIndex = 0;
                }

                const newSelectedKey = newTabs[newSelectedIndex].key;
                setSelectedTag(newSelectedKey);

                // onChange 콜백 호출
                if (onChange) {
                    onChange({
                        selectedIndex: newSelectedIndex,
                        previousIndex: closingIndex,
                    });
                }
            }

            return newTabs;
        });
    };

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

    // 실제 탭 높이 계산 (fontSize + paddingY*2 + borderWidth*2)
    const calculateTabHeight = (): string => {
        if (height) return typeof height === "string" ? height : `${height}px`; // 사용자가 명시적으로 height를 설정한 경우

        // rem 단위를 픽셀로 변환하기 위한 기본 값 (보통 16px)
        const remToPixel = 16;

        // fontSize를 픽셀로 변환
        const fontSizeStr =
            typeof fontSize === "string" ? fontSize : `${fontSize}px`;
        const fontSizeInPx = fontSizeStr.endsWith("rem")
            ? parseFloat(fontSizeStr) * remToPixel
            : parseFloat(fontSizeStr);

        // paddingY를 픽셀로 변환
        const paddingYStr =
            typeof paddingY === "string" ? paddingY : `${paddingY}px`;
        const paddingYInPx = paddingYStr.endsWith("rem")
            ? parseFloat(paddingYStr) * remToPixel
            : parseFloat(paddingYStr);

        // borderWidth를 픽셀로 변환
        const borderWidthStr =
            typeof borderWidth === "string" ? borderWidth : `${borderWidth}px`;
        const borderWidthInPx = parseFloat(borderWidthStr);

        // 실제 측정값을 기반으로 한 정확한 높이 계산
        // 기본값 (fontSize: 0.875rem, paddingY: 0.3rem, borderWidth: 1px)에서 실제 높이는 약 32.92px
        const baseHeight = 32.92; // 기본 설정에서의 실제 측정값
        const baseFontSize = 14; // 0.875rem * 16px
        const basePaddingY = 4.8; // 0.3rem * 16px
        const baseBorderWidth = 1;

        // 현재 설정값과 기본값의 비율을 계산하여 높이 조정
        const fontRatio = fontSizeInPx / baseFontSize;
        const paddingRatio = paddingYInPx / basePaddingY;
        const borderRatio = borderWidthInPx / baseBorderWidth;

        // 각 요소의 기여도를 고려한 총 높이 계산
        const adjustedHeight =
            baseHeight * ((fontRatio + paddingRatio + borderRatio) / 3);

        return `${adjustedHeight / remToPixel}rem`;
    };

    const calculatedHeight = calculateTabHeight();

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

    return (
        <div
            className="chip-tabs-container"
            style={{
                position: "relative",
                overflow: "hidden",
                minHeight: calculatedHeight,
            }}
        >
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
