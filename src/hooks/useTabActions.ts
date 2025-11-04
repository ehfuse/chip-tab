import type { ChipTabProps } from "../types";

interface UseTabActionsProps {
    tabs: ChipTabProps[];
    tagItems: ChipTabProps[];
    selectedTag: string;
    isDragging: boolean;
    setSelectedTag: (key: string) => void;
    setTabs: React.Dispatch<React.SetStateAction<ChipTabProps[]>>;
    onChange?: (data: { selectedIndex: number; previousIndex: number }) => void;
    onClose?: (key: string) => void | boolean | Promise<void | boolean>;
}

export const useTabActions = ({
    tabs,
    tagItems,
    selectedTag,
    isDragging,
    setSelectedTag,
    setTabs,
    onChange,
    onClose,
}: UseTabActionsProps) => {
    // 클릭 핸들러 - 선택된 태그 업데이트
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
    };

    // Close 버튼 클릭 핸들러
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

    return {
        handleClick,
        handleCloseClick,
    };
};
