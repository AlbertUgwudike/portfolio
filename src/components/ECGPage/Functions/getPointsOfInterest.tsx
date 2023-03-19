import { WaveName, PointOfInterest, constants, Parameters, LeadDetail, EcgEvent } from "../Generator/ECGTypes";

type Info = {
    waveName: WaveName;
    description: string;
};

// ewwww imperative function
const determinePosition = (waveName: WaveName, parameters: Parameters): number => {
    let acc = 0
    for (const [name, { radius }] of Object.entries(parameters.waves)) {
        acc += name === waveName ? radius : 2 * radius;
        if (name === waveName) break;
    }
    return parameters.start + acc - 25;
}

const infoReducer = (leadDetail: LeadDetail, event: EcgEvent, acc: PointOfInterest[], info: Info): PointOfInterest[] => {
    const waveCenter = determinePosition(info.waveName, event.parameters);
    const x = waveCenter * constants.scaleFactor;
    const y = constants.isoelectrics[leadDetail.row] + 10;
    const inbounds = waveCenter > leadDetail.startIdx && waveCenter < leadDetail.startIdx + leadDetail.sampleCount;
    return inbounds ? acc.concat([{ infoPos: { x, y }, description: info.description }]) : acc;
}

const eventsMap = (leadDetail: LeadDetail, event: EcgEvent): PointOfInterest[] => {
    return event.information.reduce(
        (acc, info) => infoReducer(leadDetail, event, acc, info), 
        [] as PointOfInterest[]
    );
}

const detailToPOIs = (leadDetail: LeadDetail): PointOfInterest[][] => {
    return leadDetail.events.map(event => eventsMap(leadDetail, event))
}

const getPointsOfInterest = (leadDetails: LeadDetail[]): PointOfInterest[] => {
    return leadDetails.map(
        leadDetail => detailToPOIs(leadDetail)
    ).flat(2)
}

export default getPointsOfInterest;