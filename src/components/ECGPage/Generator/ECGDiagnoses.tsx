import { randomVal } from "../Functions/utility";
import { Change, Diagnosis, EcgTopic, FirmDiagnosis, Predicate, WaveName } from "./ECGTypes";

export const retrieveDiagnoses =  (topics: EcgTopic[]): FirmDiagnosis => {

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const relevantDiagnoses = diagnoses.filter(diagnosis => diagnosis.topics.includes(randomTopic.name));
    const selectedDiagnosis = relevantDiagnoses[Math.floor(Math.random() * relevantDiagnoses.length)];
    //const selectedDiagnosis = diagnoses[0];


    return {
        ...selectedDiagnosis,
        rate: selectedDiagnosis.rate === "default" ? randomVal( 60, 90) : selectedDiagnosis.rate,
        axis: selectedDiagnosis.axis === "default" ? randomVal(-30, 90) : selectedDiagnosis.axis,
        changes: selectedDiagnosis.changes.concat(selectedDiagnosis.rhythm === "Irregular" ? generateOffsets() : [])
    }

}

const labelChange = (predicates: Predicate[], information: { waveName: WaveName, description: string }[]): Change => {
    return {
        information: information,
        predicates: predicates,
        parameters: {
            start: 0,
            waves: {
                p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                pr: { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                t:  { radius: 1, mag: 1, upstroke: 0, kurtosis: 1 }
            }
        }
    }
}

const generateOffsets = (): Change[] => {
    return Array(100).fill(0).map((_, index) => {
        return {
            information: [],
            predicates: [{ kind: "index", index: index }],
            parameters: {
                start: randomVal(-100, 100),
                waves: {
                    p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                    pr: { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                    r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                    t:  { radius: 1, mag: 1, upstroke: 0, kurtosis: 1 }
                }
            }
        }
    })
}

// As per the master plan Diagnoses shoudl contain:
// ---- Global changes; Rate, Rhythm, Axis
// ---- Event-level changes: queries associated with specific wave changes

const diagnoses: Diagnosis[] = [
    {
        topics: ["Rate"],
        diagnosis: "Sinus Bradycardia",
        explanation: "Heart rate < 60 with normal wave morphology",

        rate: 40,
        axis: "default",
        rhythm: "Regular",

        changes: [
            labelChange([{ kind: "lead", leads: ["Rhythm"]}], [ { waveName: "r", description: "slow" } ])
        ]
    },
    //--------------------------------------------------------------------------------------
    {
        topics: ["Rate"],
        diagnosis: "Ventricular Tachycardia",
        explanation: "Tachycardia with broad qrs complexes",

        rate: 200,
        axis: "default",
        rhythm: "Regular",

        changes: [
            labelChange([{ kind: "lead", leads: ["Rhythm"]}], [ { waveName: "r", description: "regular fast ventricular rhythm" } ]),
            {
                information: [],
                predicates: [{ kind: "all" }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 0, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 0, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 15, mag: 1, upstroke: 0,  kurtosis: 0.5 },
                        t:  { radius: 0, mag: 1, upstroke: 0, kurtosis: 1 }
                    }
                }
            },
        ]
    },
    //--------------------------------------------------------------------------------------
    {
        topics: ["ACS"],
        diagnosis: "Inferior STEMI",
        explanation: "ST segment elevation in leads II, III and aVF",

        rate: "default",
        axis: "default",
        rhythm: "Regular",

        changes: [
            {
                information: [ { waveName: "t", description: "ST elevation" } ],
                predicates: [{ kind: "lead", leads: ["II", "III", "aVF", "Rhythm"] }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 5, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 70, kurtosis: 1 }
                    }
                }
            }
        ]
    },
//--------------------------------------------------------------------------------------
    {
        topics: ["ACS"],
        diagnosis: "Septal STEMI",
        explanation: "ST segment elevation in leads V1 and V2",

        rate: "default",
        axis: "default",
        rhythm: "Regular",

        changes: [
            {
                information: [ { waveName: "t", description: "ST elevation" } ],
                predicates: [{ kind: "lead", leads: ["V1", "V2"] }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 5, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: -2, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 70, kurtosis: 1 }
                    }
                }
            }
        ]
    },
//--------------------------------------------------------------------------------------
    {
        topics: ["ACS"],
        diagnosis: "Lateral STEMI",
        explanation: "ST segment elevation in leads I and aVL",

        rate: "default",
        axis: "default",
        rhythm: "Regular",

        changes: [
            {
                information: [ { waveName: "t", description: "ST elevation" } ],
                predicates: [{ kind: "lead", leads: ["I", "aVL"] }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 5, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 3, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 70, kurtosis: 1 }
                    }
                }
            },
        ]
    },
//--------------------------------------------------------------------------------------
    {
        topics: ["ACS"],
        diagnosis: "Anterior STEMI",
        explanation: "ST segment elevation in leads V3 and V4",

        rate: "default",
        axis: "default",
        rhythm: "Regular",

        changes: [
            {
                information: [ { waveName: "t", description: "ST elevation" } ],
                predicates: [{ kind: "lead", leads: ["V3", "V4"] }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 5, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 70, kurtosis: 1 }
                    }
                }
            }
        ]
    },
//--------------------------------------------------------------------------------------
    {
        topics: ["Arrhythmias", "Rate"],
        diagnosis: "Atrial Flutter",
        explanation: "Regular fast rate, sawtooth atrial baseline",

        rate: 300,
        axis: "default",
        rhythm: "Regular",

        changes: [
            labelChange([{ kind: "lead", leads: ["Rhythm"] }, { kind: "startRepeat", start: 0, repeat: 3 }], [{ waveName: "r", description: "Conduction every third p-wave" }]),
            labelChange([{ kind: "lead", leads: ["Rhythm"] }, { kind: "startRepeat", start: 2, repeat: 3 }], [{ waveName: "p", description: "Saw tooth atrial baseline" }]),
            {
                information: [],
                predicates: [{ kind: "startRepeat", start: 0, repeat: 3 }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 0.5 },
                        pr: { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 0, upstroke: 0, kurtosis: 1 }
                    }
                }
            },
            
            {
                information: [ ],
                predicates: [{ kind: "startRepeat", start: 1, repeat: 3 }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 0.5 },
                        pr: { radius: 0, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 0, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 0, upstroke: 0, kurtosis: 1 }
                    }
                }
            },

            {
                information: [],
                predicates: [{ kind: "startRepeat", start: 2, repeat: 3 }],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 0.5 },
                        pr: { radius: 0, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 0, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 0, upstroke: 0, kurtosis: 1 }
                    }
                }
            },
        ]
    },
//--------------------------------------------------------------------------------------
    {
        topics: ["Arrhythmias"],
        diagnosis: "Moibtz I Second Degree Heart Block",
        explanation: "Progressive Lengthening of the PR interval",

        rate: "default",
        axis: "default",
        rhythm: "Regular",

        changes: [
            labelChange([{ kind: "lead", leads: ["Rhythm"] }, { kind: "startRepeat", start: 0, repeat: 4 }], [{ waveName: "pr", description: "first" }]),
            labelChange([{ kind: "lead", leads: ["Rhythm"] }, { kind: "startRepeat", start: 1, repeat: 4 }], [{ waveName: "pr", description: "second" }]),
            labelChange([{ kind: "lead", leads: ["Rhythm"] }, { kind: "startRepeat", start: 2, repeat: 4 }], [{ waveName: "pr", description: "third" }]),
            labelChange([{ kind: "lead", leads: ["Rhythm"] }, { kind: "startRepeat", start: 3, repeat: 4 }], [{ waveName: "r", description: "gone" }]),
            {
                information: [],
                predicates: [{ kind: "startRepeat", start: 1, repeat: 4 }],
                parameters: {
                    start: -25,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 25, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 0, kurtosis: 1 }
                    }
                }
            },

            {
                information: [],
                predicates: [{ kind: "startRepeat", start: 2, repeat: 4 }],
                parameters: {
                    start: -50,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 50, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 0, kurtosis: 1 }
                    }
                }
            },

            {
                information: [],
                predicates: [{ kind: "startRepeat", start: 3, repeat: 4 }],
                parameters: {
                    start: -75,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 75, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 0, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 0, upstroke: 0, kurtosis: 1 }
                    }
                }
            },
        ]
    },
//--------------------------------------------------------------------------------------
    {
        topics: ["Rate"],
        diagnosis: "Sinus Tachycardia",
        explanation: "Tachycardia with normal qrst complexes",

        rate: 120,
        axis: "default",
        rhythm: "Regular",

        changes: [
            {
                information: [ { waveName: "r", description: "fast" } ],
                predicates: [{ kind: "lead", leads: ["Rhythm"]}],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 0, kurtosis: 1 }
                    }
                }
            },
        ]
    },
    //--------------------------------------------------------------------------------------
    {
        topics: ["Arrhythmias"],
        diagnosis: "Atrial Fibrillation",
        explanation: "Irregularly irregular rhythm with absent p-waves",

        rate: "default",
        axis: "default",
        rhythm: "Irregular",

        changes: [
            labelChange([{ kind: "lead", leads: ["Rhythm"] }], [{ waveName: "p", description: "absent" }]),
            {
                information: [],
                predicates: [{ kind: "all"}],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 1, mag: 0, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 1, mag: 1, upstroke: 0,  kurtosis: 1 },
                        t:  { radius: 1, mag: 1, upstroke: 0, kurtosis: 1 }
                    }
                }
            }
        ]
    },
    //--------------------------------------------------------------------------------------
    {
        topics: ["Arrhythmias"],
        diagnosis: "Ventricular Fibrillation",
        explanation: "Irregular broad complexes",

        rate: 450,
        axis: "default",
        rhythm: "Irregular",

        changes: [
            labelChange([{ kind: "lead", leads: ["Rhythm"] }, { kind: "startRepeat", start: 10, repeat: 10 }], [{ waveName: "r", description: "Irregular, ventricular rhythm" }]),
            {
                information: [],
                predicates: [{ kind: "all"}],
                parameters: {
                    start: 0,
                    waves: {
                        p:  { radius: 0, mag: 1, upstroke: 0,  kurtosis: 1 },
                        pr: { radius: 0, mag: 1, upstroke: 0,  kurtosis: 1 },
                        r:  { radius: 10, mag: 0.5, upstroke: 0, kurtosis: 0.4 },
                        t:  { radius: 0, mag: 0, upstroke: 0, kurtosis: 1 }
                    }
                }
            },
        ]
    },
]