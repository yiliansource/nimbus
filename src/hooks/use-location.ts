import { useEffect, useState } from "react";

export const useLocation = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setLocation({ latitude, longitude });
        });
    });

    return location;
};
