// 쿠키 유틸리티 함수
export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

export const setCookie = (name: string, value: string, days: number = 365) => {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// 탭 높이 계산 유틸리티 함수
export const calculateTabHeight = (
    height: string | number | undefined,
    fontSize: string | number = "0.875rem",
    paddingY: string | number = "0.3rem",
    borderWidth: string | number = "1px"
): string => {
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
