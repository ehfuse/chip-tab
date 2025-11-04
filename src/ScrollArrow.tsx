import React, { CSSProperties, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface ScrollArrowProps {
    direction: "left" | "right";
    isEnabled: boolean;
    onClick: () => void;
}

export function ScrollArrow({
    direction,
    isEnabled,
    onClick,
}: ScrollArrowProps) {
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
