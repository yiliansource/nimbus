import { useEffect, useState } from "react";

export const useDrag = (
    ref: React.RefObject<HTMLDivElement | null>,
    deps: unknown[] = [],
    options: {
        onPointerDown?: (e: PointerEvent) => void;
        onPointerUp?: (e: PointerEvent) => void;
        onPointerMove?: (e: PointerEvent) => void;
        onDrag?: (e: PointerEvent) => void;
    },
) => {
    const { onPointerDown = () => {}, onPointerUp = () => {}, onPointerMove = () => {}, onDrag = () => {} } = options;

    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = (e: PointerEvent) => {
        setIsDragging(true);

        onPointerDown(e);
    };

    const handlePointerUp = (e: PointerEvent) => {
        setIsDragging(false);

        onPointerUp(e);
    };

    const handlePointerMove = (e: PointerEvent) => {
        onPointerMove(e);

        if (isDragging) {
            onDrag(e);
        }
    };

    useEffect(() => {
        const element = ref.current;
        if (element) {
            element.addEventListener("pointerdown", handlePointerDown);
            element.addEventListener("pointerup", handlePointerUp);
            element.addEventListener("pointermove", handlePointerMove);

            return () => {
                element.removeEventListener("pointerdown", handlePointerDown);
                element.removeEventListener("pointerup", handlePointerUp);
                element.removeEventListener("pointermove", handlePointerMove);
            };
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, isDragging, ref]);

    return { isDragging };
};
