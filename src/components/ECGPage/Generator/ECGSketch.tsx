import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useState } from "react";
import { Theme } from "./ECGSketchThemes";
import { EcgQuestion, constants } from "./ECGTypes";
import { FaArrowUp } from "react-icons/fa";
import { copy } from "../Functions/utility";

const ECGSketch = (props: { question: EcgQuestion; theme: Theme; reviewMode: boolean }) => {
    const [selectedPOI, updateSelectedPOI] = useState(-1);
    useEffect(() => updateSelectedPOI(-1), [props.question]);

    const [prevSignal, updatePrevSignal] = useState(Array(4).fill(Array(5000).fill(0)));

    const { canvasWidth, canvasHeight, isoelectrics, sampleCount, leadConstants } = constants;
    const horizontalLittleSquareCount = 250;
    const verticalLittleSquareCount = 80;

    // ONLY RENDER WHEN A VIABLE props.question.signal IS AVAILABLE
    const viableSignal = props.question.signal.reduce(
        (flag, row) => row && row.length === sampleCount && flag,
        true as boolean
    );
    const emptySignal = props.question.signal.length === 0;
    const POIOutOfBounds = selectedPOI >= props.question.pointsOfInterest.length;

    if (!viableSignal || emptySignal || POIOutOfBounds) return <></>;

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    };

    const draw = (p5: p5Types) => {
        p5.background(props.theme.background);

        // draw le markers
        for (let i = 0; i < horizontalLittleSquareCount; i++) {
            const xcoord = (i * canvasWidth) / horizontalLittleSquareCount;

            if (i % 5 === 0) {
                p5.stroke(props.theme.majorTick);
                p5.strokeWeight(1.5);
                p5.line(xcoord, 0, xcoord, canvasHeight);
            } else {
                p5.stroke(props.theme.minorTick);
                p5.strokeWeight(0.5);
                p5.line(xcoord, 0, xcoord, canvasHeight);
            }
        }

        for (let i = 0; i < verticalLittleSquareCount; i++) {
            const ycoord = (i * canvasHeight) / verticalLittleSquareCount;

            if (i % 5 === 0) {
                p5.stroke(props.theme.majorTick);
                p5.strokeWeight(1.5);
                p5.line(0, ycoord, canvasWidth, ycoord);
            } else {
                p5.stroke(props.theme.minorTick);
                p5.strokeWeight(0.5);
                p5.line(0, ycoord, canvasWidth, ycoord);
            }
        }

        // draw le labels
        p5.stroke(props.theme.label);
        p5.strokeWeight(1);
        for (const { labelPos, lead } of leadConstants) {
            p5.text(lead, labelPos.x, labelPos.y);
        }

        // watermark
        p5.stroke(props.theme.watermark);
        p5.fill(props.theme.watermark);
        p5.text("MedBakery Ltd\nmedbakery.co.uk", 10, 310);

        //nudge the previousSignal
        let prevCopy = copy(prevSignal); //sooooo slow ugggggh
        isoelectrics.map((_, row) => {
            for (let i = 0; i < sampleCount; i++) {
                const nudge = 0.2 * (props.question.signal[row][i] - prevCopy[row][i]);
                if (true) prevCopy[row][i] += nudge;
            }
        });
        updatePrevSignal(prevCopy);

        // draw le props.question.signals
        isoelectrics.map((iso, row) => {
            p5.fill(0, 0, 0, 0);
            p5.stroke(props.theme.signal);
            p5.beginShape();
            for (let i = 0; i < sampleCount; i++) {
                p5.vertex((i * canvasWidth) / sampleCount, iso - prevSignal[row][i]);
            }
            p5.endShape();
        });
    };

    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ overflow: "scroll", display: "inline-block" }}>
                <div
                    style={{
                        position: "relative",
                        width: canvasWidth,
                        height: canvasHeight,
                        overflow: "hidden",
                    }}>
                    <div style={{ position: "absolute", top: 0, left: 0 }}>
                        <Sketch setup={setup} draw={draw} />
                    </div>

                    {props.reviewMode ? (
                        <>
                            {props.question.pointsOfInterest.map((poi, idx) => (
                                <FaArrowUp
                                    size={idx === selectedPOI ? 20 : 10}
                                    style={{
                                        position: "absolute",
                                        top: poi.infoPos.y,
                                        left: poi.infoPos.x,
                                        opacity: idx === selectedPOI ? "1" : "0.5",
                                        color: idx === selectedPOI ? "green" : "black",
                                    }}
                                    onClick={() => updateSelectedPOI(idx)}
                                />
                            ))}

                            <div
                                style={{
                                    width: "500px",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    position: "absolute",
                                    left: 250,
                                    top: 310,
                                    color: "white",
                                }}>
                                {selectedPOI === -1
                                    ? "choose a point of interest!"
                                    : props.question.pointsOfInterest[selectedPOI].description}
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ECGSketch;
