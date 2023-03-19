import { retrieveDiagnoses } from "./ECGDiagnoses";
import { EcgEvent, EcgTopic, Lead, Predicate, WaveParameters, WaveParameterEntry, EcgQuestion, constants, LeadDetail, LeadConstant, Change, FirmDiagnosis, WaveSettingsEntry, WaveName } from "./ECGTypes";
import { qualifyAxis, randomVal, qualifyHR, copy, reduce } from "../Functions/utility";
import getPointsOfInterest from "../Functions/getPointsOfInterest";
import generateSignal from "../Functions/renderLead";

type EventIdx = number;
type Flag = boolean;

type IdxToEvent = (_: FirmDiagnosis, __: WaveParameters, ___: LeadConstant, ____: EventIdx) => EcgEvent;
type ConstantToDetail = (_: FirmDiagnosis, __: WaveParameters, ___: LeadConstant) => LeadDetail;
type ChangeReducer = (_: Lead, __: EventIdx, ___: EcgEvent, ____: Change) => EcgEvent;
type PredicateReducer = (_: Lead, __: EventIdx, ___: Flag,  ____: Predicate) => boolean;
type SettingsReducer = (_: WaveName, __: WaveParameters, ___: WaveSettingsEntry) => WaveParameters

// Master Plan
// first somehow collate the necessary changes form selected topics into list of list of signal parameters
// ---- randomly choose a subset of diagnoses using teh user seleccted topics
// ---- compile the chnages specified by these diangoses into a set of ecgEvents
// --------- create a template with the rate rhythm and axis (dedicated createTemplate function)
// -------------- create a master series of events over 5000 samples
// -------------- take chunks of this master strip for each lead (OVERLAP the boundaries!!!)
// --------- iterate through the events in this template and modify individual eventsParameters using query matching
// --------- we could set a percedence at the level of queries denoting the order of application (enables fancy things like mobitz)
// --------- iterate through events converting these parameters to signals (old generate ecg function)
// ---- pass to sketch :-)

// baaaad bobundary problem waaaaaah
// SOLUTION WHAAAAAT just had an awesome epiphany momnet, the OVERLAP thing above tehe

// interesting NB ==> durations of segmetns and interval DO NOT change between leads, only voltage changes do (obvious but important)

// overlapping events ==> include teh events startIdx, fold over the events passing the array to the geenrate function each time (i.e allow overwriting)

const settingsReducer: SettingsReducer = (waveLetter, waves, [setting, value]) => { 
    const newWaves = copy(waves);
    newWaves[waveLetter][setting] *= value;
    return newWaves; 
}

const waveReducer = (waves: WaveParameters, [waveLetter, settings]: WaveParameterEntry): WaveParameters => {
    return reduce((wavess, entry) => settingsReducer(waveLetter, wavess, entry), waves, settings);
}

const predicateReducer: PredicateReducer = (lead, eventIdx, flag,  predicate) => {
    if (predicate.kind === "startRepeat") return flag && ((eventIdx - predicate.start) % predicate.repeat) === 0;
    if (predicate.kind === "lead")        return flag && predicate.leads.includes(lead);
    if (predicate.kind === "index")       return flag && eventIdx === predicate.index;
    if (predicate.kind === "all")         return flag && true;
    return false;
}

const changeReducer: ChangeReducer = (lead, eventIdx, event, change) => {
    if (!change.predicates.reduce((flag, pred) => predicateReducer(lead, eventIdx, flag, pred), true)) return event;
    const information = event.information.concat(change.information);
    const start = event.parameters.start + change.parameters.start;
    const waves = reduce(waveReducer, event.parameters.waves, change.parameters.waves);
    return { information, parameters: { start, waves } }
}

const idxToEvent: IdxToEvent = (diagnosis, waves, { lead }, eventIdx) => {
    const start = eventIdx * 5000 / Math.floor(diagnosis.rate / 6);
    const event: EcgEvent = { information: [], parameters: { start, waves: copy(waves) } } // no idea why we have to copy, 4 hour bug :)
    return diagnosis.changes.reduce((oldEvent, change) => changeReducer(lead, eventIdx, oldEvent, change), event);
}

const constantToDetail: ConstantToDetail = (diagnosis, identityParameters, leadConstant) => {
    const eventCount = Math.floor(diagnosis.rate / 6);
    const events = Array(eventCount).fill(0).map((_, idx) => idxToEvent(diagnosis, identityParameters, leadConstant, idx));
    const axisFactor = Math.cos( (leadConstant.phase - 80) * (22 / 7) / 180 )
    return {  ...leadConstant, events, axisFactor }
}

export const generateECG = (topics: EcgTopic[]): EcgQuestion => {
    const diagnosis = retrieveDiagnoses(topics);
    const identityParameters = {
        p:  { radius: randomVal(20, 50), mag: randomVal(2, 10),  upstroke: 0.1, kurtosis: 0.1 },
        pr: { radius: randomVal(1, 3),   mag: 0,                     upstroke: 0.1, kurtosis: 0.1 },
        r:  { radius: randomVal(5, 10),  mag: randomVal(20, 50), upstroke: 0.1, kurtosis: 0.1 },
        t:  { radius: randomVal(30, 80), mag: randomVal(5, 15),  upstroke: 0.1, kurtosis: 0.06 }
    };

    const { leadConstants, rateOptions, rhythmOptions, axisOptions, diagnosisOptions } = constants;
    const leadDetails = leadConstants.map(leadConstant => constantToDetail(diagnosis, identityParameters, leadConstant));

    return {
        signal: generateSignal(leadDetails),
        pointsOfInterest: getPointsOfInterest(leadDetails),
        explanation: diagnosis.explanation,
        answered: false,
        sections: [
            { label: "Rate",      correct: qualifyHR(diagnosis.rate),   selected: "", options: rateOptions },
            { label: "Rhythm",    correct: diagnosis.rhythm,            selected: "", options: rhythmOptions },
            { label: "Axis",      correct: qualifyAxis(diagnosis.axis), selected: "", options: axisOptions },
            { label: "Diagnosis", correct: diagnosis.diagnosis,         selected: "", options: diagnosisOptions }
        ]
    }
}