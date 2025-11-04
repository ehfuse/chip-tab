import {
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import type { ChipTabProps } from "../types";

interface UseDragAndDropProps {
    tabs: ChipTabProps[];
    setTabs: React.Dispatch<React.SetStateAction<ChipTabProps[]>>;
    onReorder?: (data: { fromIndex: number; toIndex: number }) => void;
}

export const useDragAndDrop = ({
    tabs,
    setTabs,
    onReorder,
}: UseDragAndDropProps) => {
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

    return {
        sensors,
        handleDragEnd,
    };
};
