import { WaveParameterEntry, WaveParameters } from "../Generator/ECGTypes";

export const randomVal = (min: number, max: number) =>  Math.floor(min + Math.random() * (max - min));

export const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

// Wooooaaaah
export const reduce = <K extends string, V, R>(func: (acc: R, a: [K, V]) => R, initial: R, obj: {[Property in K] : V}): R => {
    const entries = Object.entries(obj) as [K, V][];
    return entries.reduce(func, initial)
}

export const qualifyHR = (hr: number) => {
    if (hr < 60) return "Bradycardic";
    if (hr > 100) return "Tachycardic";
    else return "Normal";
}

export const qualifyAxis = (axis: number) => {
    if (axis < -30) return "Left Axis Deviation";
    if (axis > 90) return "Right Axis Deviation";
    else return "Normal";
}

export const waveDuration = (waves: WaveParameters): number => {
    const waveParamEntries = (Object.entries(waves) as WaveParameterEntry[]);
    return waveParamEntries.reduce((acc, [_, settings]) => acc + 2 * settings.radius, 0);
}
