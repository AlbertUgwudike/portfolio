import { useState } from "react";
import styled from "styled-components";
import { Content, Title } from "../Common";
import { generateECG } from "./Generator/ECGGenerator";
import ECGSketch from "./Generator/ECGSketch";
import { themes } from "./Generator/ECGSketchThemes";
import { topics } from "./Generator/ECGTypes";

const ECGPage = () => {
    const darkTheme = false;
    const [selectedTopics, updateSelectedTopics] = useState(topics);
    const [question, updateQuestion] = useState(generateECG(topics));

    const revealAnswer = () => {
        updateQuestion(q => ({ ...q, answered: true }));
    };

    const refreshECG = () => {
        updateQuestion(generateECG(topics));
    };

    return (
        <Content>
            <br />
            <Title>ECG Simulator</Title>
            <br />
            <div style={{ textAlign: "center", display: "block", overflow: "auto" }} id="ecgsketch">
                <ECGSketch
                    theme={themes[darkTheme ? 0 : 1]}
                    question={question}
                    reviewMode={question.answered}
                />
            </div>
            <div style={{ margin: "auto", width: "max-content" }}>
                <Button onClick={revealAnswer}>Reveal Pathology</Button>
                <Button onClick={refreshECG}>Generate ECG</Button>
            </div>
        </Content>
    );
};

export default ECGPage;

const Button = styled.button`
    border-style: none;
    color: var(--secondary);
    border: 2px solid var(--secondary);
    border-radius: var(--border-narrow-radius);
    font: var(--md-font);
    height: 50px;
    width: 200px;
    margin: 10px;
    &:hover {
        cursor: pointer;
    }
`;
