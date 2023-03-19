import { WaveSettings, LeadDetail, WaveParameterEntry, EcgEvent, constants, Lead } from "../Generator/ECGTypes";

type AxisFactor = number
type WaveStart = number
type Signal = number[]

type WaveReducer = (_: AxisFactor, __: [WaveStart, Signal], ___: WaveParameterEntry) => [WaveStart, Signal];
type EventsReducer = (_: AxisFactor, __: Signal, ___: EcgEvent) => Signal;

// determine magnitude of depolarisation (gaussian), center of the wave is pos === 0
const bump = (pos: number, { mag, upstroke, kurtosis }: WaveSettings): number => {
    const yScale       = mag + (pos < 0 ? 0 : upstroke);
    const yTranslation = pos < 0 ? upstroke : 0;
    return yScale * Math.pow(Math.E, -1 * (Math.pow(kurtosis * pos, 2))) + yTranslation;
}

// add each wave (p, pr, s or t) to the signal
// each wave is described by it's settings ( radius, mag, kurtosis, upstroke )
const waveReducer: WaveReducer = (axisFactor, [waveStart, signal], [_, settings]) => {
    const { radius } = settings;
    const waveEnd = waveStart + 2 * radius

    for(let i = waveStart; i < waveEnd; i++) {                              // as 'i' refers to an idx (up to 5000), subtracting 
        signal[i] += axisFactor * bump(i - waveStart - radius, settings)    // 'waveStart' and 'radius' sets the center of the wave as 0
    }

    return [waveEnd, signal]
}

// add each event to the signal
const eventsReducer: EventsReducer = (axisFactor, signal, event) => {
    const waveEntries = Object.entries(event.parameters.waves) as WaveParameterEntry[]
    return waveEntries.reduce(
        (waveParam, settingEntry) => waveReducer(axisFactor, waveParam, settingEntry), 
        [ Math.floor(event.parameters.start), signal ] as [number, number[]]
    )[1]
}

// perlinesque noise generator
const determineNoise = (arr: number[], _: number, idx: number): number[] => {
    if (idx === 0) return [0];
    const prevNoise = arr[idx - 1];
    return arr.concat([prevNoise + 0.4 * (Math.random() - 0.5) - (Math.random() * 0.0099 + 0.001) * prevNoise])
}

// convert lead (event series) to a one dimensional ECG signal
const renderLead = (leadDetails: LeadDetail[], lead: Lead): number[] => {
    const { events, startIdx, sampleCount, axisFactor } = leadDetails.find(ld => ld.lead === lead)!;
    const noisySignal = Array(constants.sampleCount).fill(0).reduce(determineNoise, [])
    return events.reduce((signal, event) => eventsReducer(axisFactor, signal, event), noisySignal).slice(startIdx, startIdx + sampleCount);
}

const renderRow = (leadDetails: LeadDetail[], row: Lead[]): number[] => {
    return row.map(lead => renderLead(leadDetails, lead)).flat()
}

const generateSignal = (leadDetails: LeadDetail[]): number[][] => {
    return constants.signalStructure.map(row => renderRow(leadDetails, row));
}

export default generateSignal;