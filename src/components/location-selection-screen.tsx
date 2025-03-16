import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";

import { locationsAtom, selectedLocationIndexAtom } from "../store";

export function LocationSelectionScreen() {
    const locations = useAtomValue(locationsAtom);

    const [selectedLocationIndex, setSelectedLocationIndex] = useAtom(selectedLocationIndexAtom);

    return (
        <div className="fixed inset-0 bg-black/50 z-10 backdrop-blur-sm px-4 py-8">
            <div className="flex flex-col">
                {locations.map((loc, index) => (
                    <div
                        key={loc.id}
                        className={clsx(
                            "flex flex-row justify-between items-center cursor-pointer py-2 px-1",
                            selectedLocationIndex === index ? "opacity-100" : "opacity-50",
                        )}
                        onClick={() => setSelectedLocationIndex(index)}
                    >
                        <div className="flex flex-col">
                            <p className="font-semibold text-lg">{loc.name}</p>
                            <p className="text-sm">{loc.country}</p>
                        </div>
                        <div>
                            <p className="text-5xl font-extralight">29°</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
