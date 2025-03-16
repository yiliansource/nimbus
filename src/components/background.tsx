import moment from "moment";
import { MotionConfig, motion } from "motion/react";
import { useEffect, useState } from "react";

import { ColorTheme, dayTheme, nightTheme } from "../theme";

export function Background({ timeOffset }: { timeOffset: number }) {
    const [currentTime, setCurrentTime] = useState(moment().add(timeOffset));

    useEffect(() => {
        setCurrentTime(moment().add(timeOffset));

        const interval = setInterval(() => {
            setCurrentTime(moment().add(timeOffset));
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [timeOffset]);

    const hourOfDay = currentTime.hours() + currentTime.minutes() / 60 + currentTime.seconds() / (60 * 60);

    const sunPositionY = 50 + Math.cos((2 * Math.PI * hourOfDay) / 24) * 25;
    const moonPositionY = 50 - Math.cos((2 * Math.PI * hourOfDay) / 24) * 25;

    const sunHeightRelative = -(sunPositionY - 50) / 25;
    const sunScale = (sunHeightRelative * (1 - 0.8) + 1 * 0.8 - 1 * 0.5) / (1 - 0.5);

    const isNight = hourOfDay < 6 || hourOfDay >= 18;
    const isDay = !isNight;

    const theme = isDay ? dayTheme : nightTheme;

    return (
        <MotionConfig transition={{ duration: 0.5 }}>
            <motion.div
                className="absolute -z-10 top-0 left-0 w-full h-full"
                animate={{ backgroundColor: theme.foreground[0][0] }}
                initial={false}
            >
                <svg viewBox="0 0 49.741666 88.370837">
                    <GradientDefs theme={theme} />
                    <g>
                        <g id="background">
                            <rect
                                fill="url(#backgroundGradient)"
                                width="52.916664"
                                height="95.438988"
                                x="-0.92201203"
                                y="-1.1339285"
                            />
                            <MotionConfig transition={{ duration: 1 }}>
                                <motion.g
                                    initial={false}
                                    animate={{
                                        translateX: 40,
                                        translateY: sunPositionY,
                                        scale: Math.max(0, sunScale),
                                    }}
                                >
                                    <motion.g
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut",
                                            duration: 2,
                                        }}
                                    >
                                        <motion.circle
                                            animate={{ r: 8.6 }}
                                            initial={false}
                                            fill="#fcf7f1"
                                            opacity={0.25}
                                        />
                                        <motion.circle
                                            animate={{ r: 7.2 }}
                                            initial={false}
                                            fill="#fcf7f1"
                                            opacity={0.5}
                                        />
                                        <motion.circle animate={{ r: 6 }} initial={false} fill="#fcf7f1" />
                                    </motion.g>
                                </motion.g>
                                <motion.g initial={false} animate={{ translateX: 40, translateY: moonPositionY }}>
                                    <motion.g
                                        initial={{ rotate: 5 }}
                                        animate={{ rotate: -5 }}
                                        transition={{
                                            ease: "easeInOut",
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            duration: 3,
                                        }}
                                    >
                                        <path
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                            fill="#e0f9fd"
                                            transform="scale(0.7) translate(-12 -12)"
                                            filter="drop-shadow(0 0 4 rgba(224, 249, 253, 0.7))"
                                        />
                                    </motion.g>
                                </motion.g>
                            </MotionConfig>
                        </g>
                        <g id="mountains">
                            <path
                                fill="url(#gradientMountains3)"
                                d="m 44.634012,50.7478 c 0,0 -5.445617,-5.81311 -8.385582,-9.354431 -2.939966,-3.541324 -4.744035,-5.629365 -5.428912,-6.431174 -0.684879,-0.80181 -1.135896,-1.453277 -1.687139,-1.419871 -0.551244,0.03341 -0.952148,0.517837 -1.269532,0.7684 -0.317381,0.250566 -0.634764,0.618062 -1.085781,0.618062 -0.451018,0 -1.069079,-0.400905 -1.987818,-1.703843 -0.918739,-1.30294 -2.104747,-2.789626 -2.472243,-3.57473 -0.367495,-0.785103 -0.799958,-0.835218 -1.102487,-0.835218 -0.684929,0 -0.751695,0.634765 -1.586912,0.701583 -0.835218,0.06682 -4.827556,0 -4.827556,0 0,0 -3.223939,-4.660512 -3.908817,-5.696182 -0.684878,-1.035669 -1.9711127,-2.990077 -2.3219039,-3.57473 -0.3507912,-0.584652 -0.9187389,-1.319643 -1.4365737,-1.319643 -0.5178345,0 -1.2528259,0.467722 -1.9042954,1.018965 -0.6514695,0.551244 -9.7052245,7.917859 -9.7052245,7.917859 v 22.784729 z"
                            />
                            <path
                                fill="url(#gradientMountains2)"
                                d="m -2.4801607,11.41421 c 0,0 9.8510049,13.583519 10.5833338,14.59933 0.7323288,1.01581 1.0866815,1.653646 1.4410343,1.677268 0.3543525,0.02363 0.9213176,0.259861 2.7639516,-1.157552 1.842634,-1.417409 1.937128,-1.630021 2.763951,-1.606398 0.826822,0.02362 1.252046,0.779576 1.795386,1.511905 0.543341,0.732329 7.110676,8.457218 8.551711,10.087239 1.441034,1.630024 4.91369,5.197173 6.638207,6.189361 1.724515,0.992187 5.291667,-0.330729 6.378347,-0.850448 1.086681,-0.519715 3.496281,-2.69308 4.582962,-2.69308 1.086681,0 2.740327,2.433222 3.732514,3.921504 0.992188,1.488281 4.51209,8.291853 4.51209,8.291853 H -3.4350547 Z"
                            />
                            <path
                                fill="url(#gradientMountains1)"
                                d="m -1.9699602,31.95729 c 0,0 1.69336195,-2.046862 2.56743195,-3.133542 0.87407005,-1.086681 1.77176405,-2.031622 2.69308005,-2.008 0.921317,0.02363 1.866258,1.417413 2.55134,2.220611 0.685082,0.803201 1.913504,2.362351 2.716704,3.307292 0.803199,0.94494 1.8190112,2.480468 2.5277162,2.480468 0.708705,0 0.732329,-0.188986 1.015811,-0.377976 0.283482,-0.188989 0.779576,-0.425222 1.228423,-0.425222 0.448846,0 1.441034,0.212611 3.63802,2.858445 2.196987,2.645833 14.244979,14.882812 14.244979,14.882812 l -33.0492952,0.188986 z"
                            />
                        </g>
                        <g id="foreground">
                            <rect
                                fill="url(#gradientWater)"
                                id="water"
                                width="57.12886"
                                height="24.187893"
                                x="-3.988301"
                                y="48.356445"
                            />
                            <path
                                id="treesBack"
                                fill="url(#gradientForegroundSecondary)"
                                d="m 5.4378077,46.006288 c 0,0 -0.425519,1.204429 -1.03973,2.338359 -0.614212,1.13393 -1.228349,1.889805 -1.228349,1.889805 l 0.992187,-0.259414 -1.13378,1.559076 0.850077,-0.04754 -2.031401,3.331062 0.732255,-0.377754 -1.033528,1.15135 c -3.737145,-0.417875 -6.523633,-0.399976 -6.523633,-0.399976 h -0.868681 L -5.8938053,75.55332 25.65879,75.50629 c 0,0 -0.02325,-6.672207 -0.02325,-8.782409 -3.015369,-2.731493 -7.49438,-6.264508 -12.405448,-8.358664 -1.451869,-0.619099 -3.010743,-1.117539 -4.5831833,-1.518769 -0.243802,-0.503336 -0.540019,-1.249019 -0.540019,-1.249019 l 1.015959,0.117822 -0.708484,-0.92139 0.519348,-0.141595 c 0,0 -0.685008,-0.543414 -1.228349,-1.252119 -0.54334,-0.708705 -0.873848,-1.866038 -0.873848,-1.866038 l 0.850077,0.04703 c 0,0 -0.425075,-0.354057 -0.637687,-0.613915 -0.212612,-0.259858 -0.306958,-0.850596 -0.306958,-0.850596 l 0.968416,0.212392 c 0,0 -0.826896,-0.873702 -1.417484,-1.842265 -0.590588,-0.968565 -0.850077,-2.480469 -0.850077,-2.480469 z"
                            />
                            <path
                                id="treesFront"
                                fill="url(#gradientForegroundPrimary)"
                                d="m 41.826812,37.529356 c 0,0 -1.20282,3.491378 -1.73736,4.610571 -0.534537,1.11919 -2.037601,3.34088 -2.037601,3.34088 l 1.3193,-0.350882 -1.219047,2.956925 1.519804,-1.921327 c 0,0 -1.052108,3.157161 -1.620057,4.109309 -0.567946,0.952143 -2.13837,2.672705 -2.13837,2.672705 l 1.035595,-0.33383 -1.219047,1.753899 1.820561,-0.384474 -1.25367,1.982824 c -0.255463,0.05875 -0.519133,0.120918 -0.784966,0.183968 -0.338031,-0.462569 -0.762695,-1.058045 -1.151868,-1.665531 -0.699426,-1.091785 -1.269688,-2.689241 -1.269688,-2.689241 0,0 0.245967,0.149011 0.506944,0.204121 0.260975,0.05512 0.595829,0.04651 0.595829,0.04651 0,3e-6 -0.518071,-0.43457 -0.902269,-1.002522 -0.384204,-0.567947 -0.467673,-1.352889 -0.467673,-1.352889 0,0 0.24279,0.302001 0.700218,0.549839 0.456083,0.247108 0.87023,0.184999 0.87023,0.184999 0,0 -1.252821,-1.570397 -1.954403,-2.706293 -0.701582,-1.135896 -1.219565,-3.290755 -1.219565,-3.290755 0,0 -0.451191,2.004896 -1.319816,3.408061 -0.868627,1.403165 -1.854149,2.605524 -1.854149,2.605524 l 1.386477,-0.634585 -1.486731,2.622579 1.185977,-0.784966 c 0,0 -0.634731,1.803927 -1.185977,2.739369 -0.551241,0.935443 -1.503266,1.954401 -1.503266,1.954401 l 1.002005,-0.451134 -1.352888,1.720824 1.352888,-0.317294 -0.627867,1.185977 c -0.294117,0.08559 -0.567167,0.162348 -0.870232,0.251663 C 11.677527,62.933565 3.9160056,67.04737 -0.22850045,68.650456 -4.3730044,70.25354 -6.6777194,71.886435 -6.6777194,71.886435 l 0.117822,22.985676 H 58.074402 v -40.91585 c 0,0 -2.81428,-0.534353 -8.2212,0 -0.62438,0.06171 -1.23197,0.116559 -1.84227,0.172082 l -1.47329,-1.665015 0.35088,0.183452 c 0.35079,0.183745 1.1188,0.21704 1.1188,0.21704 0,0 -1.38638,-1.56995 -2.32183,-2.956409 -0.93544,-1.386462 -1.21956,-2.989998 -1.21956,-2.989998 l 1.10277,0.718304 c 0,0 -0.45104,-0.768549 -0.76843,-1.219565 -0.31738,-0.451017 -0.33434,-1.085721 -0.33434,-1.085721 l 1.52032,0.13384 c 0,0 -1.77045,-2.238423 -2.48874,-3.441131 -0.71829,-1.202717 -1.6707,-4.493784 -1.6707,-4.493784 z"
                            />
                        </g>
                    </g>
                </svg>
            </motion.div>
        </MotionConfig>
    );
}

function GradientDefs({ theme }: { theme: ColorTheme }) {
    return (
        <defs>
            <linearGradient
                id="backgroundGradient"
                x1="25.270401"
                y1="-0.052968934"
                x2="25.270401"
                y2="48.189182"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(0.40090386)"
            >
                <motion.stop animate={{ stopColor: theme.background[0] }} offset="0" initial={false} />
                <motion.stop animate={{ stopColor: theme.background[1] }} offset="1" initial={false} />
            </linearGradient>
            <linearGradient
                id="gradientWater"
                x1="93.435059"
                y1="43.535961"
                x2="93.435059"
                y2="68.576881"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(-69.736607,4.7247024)"
            >
                <motion.stop animate={{ stopColor: theme.water[0] }} offset="0" initial={false} />
                <motion.stop animate={{ stopColor: theme.water[1] }} offset="0.41989806" initial={false} />
                <motion.stop animate={{ stopColor: theme.water[2] }} offset="1" id="stop1485" />
            </linearGradient>
            <linearGradient
                id="gradientForegroundSecondary"
                gradientUnits="userSpaceOnUse"
                x1="-18.483274"
                y1="45.628845"
                x2="-18.483274"
                y2="75.362579"
                gradientTransform="translate(28.224737,0.31749999)"
            >
                <motion.stop animate={{ stopColor: theme.foreground[1][0] }} offset="0" initial={false} />
                <motion.stop animate={{ stopColor: theme.foreground[1][1] }} offset="0.38451943" initial={false} />
                <motion.stop animate={{ stopColor: theme.foreground[1][2] }} offset="1" initial={false} />
            </linearGradient>
            <linearGradient
                id="gradientForegroundPrimary"
                x1="86.054298"
                y1="77.599365"
                x2="86.054298"
                y2="33.654827"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(-60.052238,0.74083331)"
            >
                <motion.stop animate={{ stopColor: theme.foreground[0][0] }} offset="0" initial={false} />
                <motion.stop animate={{ stopColor: theme.foreground[0][1] }} offset="0.318407" initial={false} />
                <motion.stop animate={{ stopColor: theme.foreground[0][2] }} offset="0.72736281" initial={false} />
                <motion.stop animate={{ stopColor: theme.foreground[0][3] }} offset="1" initial={false} />
            </linearGradient>
            <linearGradient
                id="gradientMountains3"
                x1="7.0987563"
                y1="18.96191"
                x2="7.0987563"
                y2="42.963398"
                gradientUnits="userSpaceOnUse"
            >
                <motion.stop animate={{ stopColor: theme.mountains[2][0] }} offset="0" initial={false} />
                <motion.stop animate={{ stopColor: theme.mountains[2][1] }} offset="1" initial={false} />
            </linearGradient>
            <linearGradient
                id="gradientMountains2"
                x1="10.623963"
                y1="12.5572"
                x2="10.623963"
                y2="48.304501"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(12.467482,-1.0690781)"
            >
                <motion.stop animate={{ stopColor: theme.mountains[1][0] }} offset="0" initial={false} />
                <motion.stop animate={{ stopColor: theme.mountains[1][1] }} offset="1" initial={false} />
            </linearGradient>
            <linearGradient
                id="gradientMountains1"
                x1="4.1743975"
                y1="26.978207"
                x2="4.1743975"
                y2="48.52285"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(11.015441,-0.11505402)"
            >
                <motion.stop animate={{ stopColor: theme.mountains[0][0] }} offset="0" initial={false} />
                <motion.stop animate={{ stopColor: theme.mountains[0][1] }} offset="1" initial={false} />
            </linearGradient>
        </defs>
    );
}
