const sampleCount = 5000;
const canvasHeight = 350;
const canvasWidth = 1000;
const isoelectrics = [50, 125, 200, 275];
const labelX = [10, 260, 510, 760];
const labelY = isoelectrics.map(iso => iso - 15);

interface Constants {
    sampleCount: number;
    canvasHeight: number;
    canvasWidth: number;
    scaleFactor: number;
    isoelectrics: number[];
    leadConstants: LeadConstant[];
    rhythmOptions: RhythmOption[];
    rateOptions: RateOption[];
    axisOptions: AxisOption[];
    diagnosisOptions: DiagnosisOption[];
    signalStructure: Lead[][];
}

export const constants: Constants = {
    sampleCount: sampleCount,
    canvasHeight: canvasHeight,
    canvasWidth: canvasWidth,
    scaleFactor: canvasWidth / sampleCount,
    isoelectrics: isoelectrics,
    leadConstants: [
        {
            lead: "I",
            startIdx: 0,
            sampleCount: 1250,
            row: 0,
            phase: 0,
            labelPos: { x: labelX[0], y: labelY[0] },
        },
        {
            lead: "II",
            startIdx: 0,
            sampleCount: 1250,
            row: 1,
            phase: 60,
            labelPos: { x: labelX[0], y: labelY[1] },
        },
        {
            lead: "III",
            startIdx: 0,
            sampleCount: 1250,
            row: 2,
            phase: 120,
            labelPos: { x: labelX[0], y: labelY[2] },
        },
        {
            lead: "aVR",
            startIdx: 1250,
            sampleCount: 1250,
            row: 0,
            phase: -150,
            labelPos: { x: labelX[1], y: labelY[0] },
        },
        {
            lead: "aVL",
            startIdx: 1250,
            sampleCount: 1250,
            row: 1,
            phase: -30,
            labelPos: { x: labelX[1], y: labelY[1] },
        },
        {
            lead: "aVF",
            startIdx: 1250,
            sampleCount: 1250,
            row: 2,
            phase: 90,
            labelPos: { x: labelX[1], y: labelY[2] },
        },
        {
            lead: "V1",
            startIdx: 2500,
            sampleCount: 1250,
            row: 0,
            phase: 0,
            labelPos: { x: labelX[2], y: labelY[0] },
        },
        {
            lead: "V2",
            startIdx: 2500,
            sampleCount: 1250,
            row: 1,
            phase: 24,
            labelPos: { x: labelX[2], y: labelY[1] },
        },
        {
            lead: "V3",
            startIdx: 2500,
            sampleCount: 1250,
            row: 2,
            phase: 48,
            labelPos: { x: labelX[2], y: labelY[2] },
        },
        {
            lead: "V4",
            startIdx: 3750,
            sampleCount: 1250,
            row: 0,
            phase: 72,
            labelPos: { x: labelX[3], y: labelY[0] },
        },
        {
            lead: "V5",
            startIdx: 3750,
            sampleCount: 1250,
            row: 1,
            phase: 96,
            labelPos: { x: labelX[3], y: labelY[1] },
        },
        {
            lead: "V6",
            startIdx: 3750,
            sampleCount: 1250,
            row: 2,
            phase: 120,
            labelPos: { x: labelX[3], y: labelY[2] },
        },
        {
            lead: "Rhythm",
            startIdx: 0,
            sampleCount: 5000,
            row: 3,
            phase: 60,
            labelPos: { x: labelX[0], y: labelY[3] },
        },
    ],

    rhythmOptions: ["Regular", "Irregular"],
    rateOptions: ["Tachycardic", "Bradycardic", "Normal"],
    axisOptions: ["Left Axis Deviation", "Right Axis Deviation", "Normal"],
    diagnosisOptions: [
        "Inferior STEMI",
        "Anterior STEMI",
        "Lateral STEMI",
        "Septal STEMI",
        "Ventricular Fibrillation",
        "Ventricular Tachycardia",
        "Atrial Flutter",
        "Atrial Fibrillation",
        "Moibtz I Second Degree Heart Block",
        "Sinus Bradycardia",
        "Sinus Tachycardia",
    ],

    signalStructure: [
        ["I", "aVR", "V1", "V4"],
        ["II", "aVL", "V2", "V5"],
        ["III", "aVF", "V3", "V6"],
        ["Rhythm"],
    ],
};

export type Lead =
    | "I"
    | "II"
    | "III"
    | "aVF"
    | "aVL"
    | "aVR"
    | "V1"
    | "V2"
    | "V3"
    | "V4"
    | "V5"
    | "V6"
    | "Rhythm";

export type EcgEvent = {
    // convenience fields
    information: { waveName: WaveName; description: string }[];
    // these are to be set during the selection coalition process
    parameters: Parameters;
};

// Each lead trace is represented as a list of "events"
export type EcgSignal = [
    [EcgEvent[], EcgEvent[], EcgEvent[], EcgEvent[]],
    [EcgEvent[], EcgEvent[], EcgEvent[], EcgEvent[]],
    [EcgEvent[], EcgEvent[], EcgEvent[], EcgEvent[]],
    [EcgEvent[], EcgEvent[], EcgEvent[], EcgEvent[]]
];

type TopicName = "ACS" | "Arrhythmias" | "Rate";

export type EcgTopic = {
    name: TopicName;
    selected: boolean;
    attempts: number;
    correct: number;
};

export type WaveName = "p" | "pr" | "r" | "t";
export type SettingName = "mag" | "radius" | "kurtosis" | "upstroke";

export type StartRepeat = { kind: "startRepeat"; start: number; repeat: number };
export type Predicate =
    | StartRepeat
    | { kind: "lead"; leads: Lead[] }
    | { kind: "all" }
    | { kind: "index"; index: number };

export type WaveSettings = { [Property in SettingName]: number };
export type WaveSettingsEntry = [SettingName, number];

export type WaveParameters = { [Property in WaveName]: WaveSettings };
export type WaveParameterEntry = [WaveName, WaveSettings];

export type Parameters = {
    start: number;
    waves: WaveParameters;
};

export type Change = {
    information: {
        waveName: WaveName;
        description: string;
    }[];
    predicates: Predicate[];
    parameters: Parameters;
};

export type Diagnosis = {
    topics: TopicName[];
    diagnosis: DiagnosisOption;
    explanation: string;

    rate: "default" | number; //determines numer of events
    axis: "default" | number; // to be applied at the end maybe?
    rhythm: "Irregular" | "Regular";

    // to be applied "globally"
    changes: Change[];
};

export interface FirmDiagnosis extends Diagnosis {
    rate: number;
    axis: number;
}

export type LeadConstant = {
    lead: Lead;
    startIdx: number;
    sampleCount: number;
    row: number;
    phase: number;
    labelPos: { x: number; y: number };
};
export interface LeadDetail extends LeadConstant {
    events: EcgEvent[];
    axisFactor: number;
}

export type PointOfInterest = { infoPos: { x: number; y: number }; description: string };

type RhythmOption = "Regular" | "Irregular";
type RateOption = "Tachycardic" | "Bradycardic" | "Normal";
type AxisOption = "Left Axis Deviation" | "Right Axis Deviation" | "Normal";
type DiagnosisOption =
    | "Inferior STEMI"
    | "Anterior STEMI"
    | "Lateral STEMI"
    | "Septal STEMI"
    | "Ventricular Fibrillation"
    | "Ventricular Tachycardia"
    | "Atrial Flutter"
    | "Atrial Fibrillation"
    | "Moibtz I Second Degree Heart Block"
    | "Sinus Bradycardia"
    | "Sinus Tachycardia";

export type EcgQuestion = {
    signal: number[][];
    pointsOfInterest: PointOfInterest[];
    answered: boolean;
    explanation: string;
    sections: EcgQuestionSections;
};

export type EcgQuestionSections = [
    { label: "Rate"; correct: RateOption; selected: RateOption | ""; options: RateOption[] },
    {
        label: "Rhythm";
        correct: RhythmOption;
        selected: RhythmOption | "";
        options: RhythmOption[];
    },
    { label: "Axis"; correct: AxisOption; selected: AxisOption | ""; options: AxisOption[] },
    {
        label: "Diagnosis";
        correct: DiagnosisOption;
        selected: DiagnosisOption | "";
        options: DiagnosisOption[];
    }
];

export const topics: EcgTopic[] = [
    {
        name: "Rate",
        selected: false,
        attempts: 0,
        correct: 0,
    },
    {
        name: "Arrhythmias",
        selected: false,
        attempts: 0,
        correct: 0,
    },
    {
        name: "ACS",
        selected: false,
        attempts: 0,
        correct: 0,
    },
];
