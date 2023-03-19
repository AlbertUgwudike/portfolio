type Color = [number, number, number];
export type Theme = {
    name: string,
    background: Color,
    majorTick: Color,
    minorTick: Color,
    label: Color,
    signal: Color,
    watermark: Color
}

const WHITE: Color = [255, 255, 255];
const GRAY: Color = [50, 50, 50];
const DEFAULTBLUE: Color = [25, 25, 100];
const YELLOW: Color = [250,208,0];
const RED: Color = [255, 150, 150];
const BLACK: Color = [0, 0, 0];


export const themes: Theme[] = [
    {
        name: "default",
        background: DEFAULTBLUE,
        majorTick: GRAY,
        minorTick: DEFAULTBLUE,
        label: YELLOW,
        signal: WHITE,
        watermark: WHITE
    },
    {
        name: "classic",
        background: WHITE,
        majorTick: RED,
        minorTick: RED,
        label: BLACK,
        signal: BLACK,
        watermark: GRAY
    }
]