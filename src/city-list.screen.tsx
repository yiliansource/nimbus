import clsx from "clsx";
import { AnimatePresence, Reorder, motion } from "motion/react";
import { useState } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";

import { AddCityScreen } from "./add-city-screen";
import { CityData, useAppStore } from "./store";

export function CitylistScreen({ onClose }: { onClose: () => void }) {
    const cities = useAppStore((state) => state.cities);
    const setCities = useAppStore((state) => state.setCities);
    const removeCity = useAppStore((state) => state.removeCity);
    const currentCityIndex = useAppStore((state) => state.currentCityIndex);
    const setCurrentCityIndex = useAppStore((state) => state.setCurrentCityIndex);

    const [addCityOpen, setAddCityOpen] = useState(false);

    const reorderCities = (cities: CityData[]) => {
        setCities(cities);
    };

    const handleCitySelect = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setCurrentCityIndex(index);
    };
    const handleCityDelete = (e: React.MouseEvent, city: CityData) => {
        e.stopPropagation();
        removeCity(city.id);

        if (cities.length <= 1) {
            onClose();
        }
    };

    return (
        <>
            <AnimatePresence>
                {addCityOpen && <AddCityScreen canClose={true} onClose={() => setAddCityOpen(false)} />}
            </AnimatePresence>
            <motion.div
                className="fixed top-0 left-0 w-screen h-screen bg-zinc-900/90 backdrop-blur z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="p-6">
                    <div className="mb-4 flex flex-row justify-between">
                        <h2 className="text-2xl font-bold">Locations</h2>
                        <motion.div
                            className="p-1 text-xl text-zinc-400"
                            onClick={() => void onClose()}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <FaTimes />
                        </motion.div>
                    </div>
                    <div className="mb-4">
                        <Reorder.Group axis="y" values={cities} onReorder={reorderCities}>
                            {cities.map((city, cityIndex) => (
                                <Reorder.Item key={city.id} value={city}>
                                    <div
                                        className="py-2 flex flex-row items-center"
                                        onClick={(e) => handleCitySelect(e, cityIndex)}
                                    >
                                        {/* <div className="mr-2 ">
                                            <div className={clsx("p-2 text-zinc-500")}>
                                                <FaGripVertical />
                                            </div>
                                        </div> */}
                                        <div
                                            className={clsx(
                                                "transition-opacity",
                                                cityIndex === currentCityIndex ? "opacity-100" : "opacity-50",
                                            )}
                                        >
                                            <p>{city.name}</p>
                                            <p className="text-xs uppercase text-zinc-400">{city.country}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-zinc-600" onClick={(e) => handleCityDelete(e, city)}>
                                                <FaTrash />
                                            </div>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>
                    <div>
                        <p className="text-zinc-400" onClick={() => setAddCityOpen(true)}>
                            Add new location...
                        </p>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
