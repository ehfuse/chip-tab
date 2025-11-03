import { CSSProperties, ReactNode } from "react";

export interface ChipTabProps {
    key: string;
    label: string;
    icon?: ReactNode;
    hideCloseButton?: boolean; // close 버튼 숨김 여부
}

export interface ChipTabStateStyles {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontWeight?: string | number;
}

export interface CloseButtonStyles {
    size?: string | number;
    hoverBgColor?: string;
}

export interface ChipTabsStyles {
    // 기본 스타일
    height?: string | number;
    fontSize?: string | number;
    borderRadius?: string | number;
    borderWidth?: string | number;
    paddingX?: string | number; // 좌우 패딩
    paddingY?: string | number; // 상하 패딩
    gap?: string | number; // 탭 간격

    // 탭 상태별 스타일
    defaultTab?: ChipTabStateStyles;
    selectedTab?: ChipTabStateStyles;
    hoverTab?: Omit<ChipTabStateStyles, "fontWeight">; // hover에는 fontWeight 불필요

    // Close 버튼 스타일
    closeButton?: CloseButtonStyles;
    closeButtonSelected?: CloseButtonStyles;

    // 추가 커스텀 스타일
    customStyles?: CSSProperties;
}

export interface ChangeEvent {
    selectedIndex: number; // 새로 선택된 탭의 인덱스
    previousIndex: number; // 이전에 선택되었던 탭의 인덱스
}

export interface ReorderEvent {
    fromIndex: number; // 이동 전 인덱스
    toIndex: number; // 이동 후 인덱스
}

export interface ChipTabsProps {
    className?: string;
    defaultSelected?: string;
    draggable?: boolean; // 드래그 앤 드롭으로 탭 순서 변경 가능 여부
    keyboardNavigation?: boolean; // 방향키로 탭 이동 가능 여부 (기본값 true)
    onChange?: (event: ChangeEvent) => void; // 탭 선택 변경 핸들러
    onClose?: (key: string) => boolean | Promise<boolean>; // close 버튼 클릭 핸들러 - true 반환 시 탭 제거
    onLoaded?: (tabs: ChipTabProps[], selectedKey: string) => void; // 쿠키에서 로드된 탭들을 반환
    onReorder?: (event: ReorderEvent) => void; // 탭 순서 변경 핸들러
    selectedCookieName?: string; // 설정 시 selectedKey를 쿠키에 자동 저장/불러오기
    selectedKey?: string; // 외부에서 선택된 키를 제어할 수 있도록 추가
    showArrows?: boolean; // 스크롤 화살표 표시 여부 (기본값 true, 비활성화 시 희미하게 표시)
    showCloseButton?: boolean; // close 버튼 표시 여부
    styles?: ChipTabsStyles; // 스타일 커스터마이징
    tabs: ChipTabProps[];
    tabsCookieName?: string; // 설정 시 tabs 배열을 쿠키에 자동 저장/불러오기
    wrap?: boolean; // flex-wrap 사용 여부 (false면 좌우 스크롤)
}
