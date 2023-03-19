import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ECGAnsweredOptions from "./ECGAnsweredOptions";
import ECGOptions from "./ECGOptions";
import ECGQuestionProgress from "./ECGQuestionProgress";
import { generateECG } from "./Generator/ECGGenerator";
import ECGSketch from "./Generator/ECGSketch";
import { themes } from "./Generator/ECGSketchThemes";
import { EcgQuestion, EcgQuestionSections, EcgTopic } from "./Generator/ECGTypes";

// lets say last question in list is **always** unaanswered
const ECGSession = (props: {
    topics: EcgTopic[];
    darkMode: boolean;
    finishEcgSession: () => void;
}) => {
    const [darkTheme, updateDarkTheme] = useState(props.darkMode);
    const [questions, updateQuestions] = useState([] as EcgQuestion[]);
    const [questionIdx, updateQuestionIdx] = useState(0);

    useEffect(() => {
        updateDarkTheme(props.darkMode);
    }, [props.darkMode]);

    useEffect(() => {
        updateQuestions([generateECG(props.topics)]);
    }, []);

    const handleOptionChange = (label: string, selected: string) => {
        const currentWorkingQuestion = questions[questions.length - 1];
        const modifiedQuestion: EcgQuestion = {
            ...currentWorkingQuestion,
            sections: currentWorkingQuestion.sections.map(s =>
                s.label === label ? { ...s, selected } : s
            ) as EcgQuestionSections,
        };
        updateQuestions(
            questions.map((q, i) => (i === questions.length - 1 ? modifiedQuestion : q))
        );
    };

    const submitAnswers = () => {
        updateQuestions(
            questions
                .map((q, i) => (i === questions.length - 1 ? { ...q, answered: true } : q))
                .concat([generateECG(props.topics)])
        );
    };

    const refreshQuestion = () => {
        const newQuestion = generateECG(props.topics);
        updateQuestions(questions.map((q, i) => (i === questions.length - 1 ? newQuestion : q)));
    };

    if (questions.length === 0) return <></>;

    // can only submit if last question and all fields answered
    const submitPermitted =
        questionIdx === questions.length - 1 &&
        questions[questions.length - 1].sections.reduce(
            (flag, section) => flag && section.selected !== "",
            true
        );

    return (
        <Container darkMode={props.darkMode} style={{ textAlign: "center" }}>
            <div style={{ font: "30px Champion", marginBottom: "30px" }}>
                {questions[questionIdx].answered ? "Review Mode" : "Interpret it!"}
            </div>

            <div style={{ textAlign: "center", display: "block", overflow: "auto" }} id="ecgsketch">
                <ECGSketch
                    theme={themes[darkTheme ? 0 : 1]}
                    question={questions[questionIdx]}
                    reviewMode={questions[questionIdx].answered}
                />
            </div>

            <div className="row" style={{ maxWidth: "1000px", margin: "auto" }}>
                <div className="col-md-4">
                    <ECGQuestionProgress
                        questionIdx={questionIdx}
                        updateQuestionIdx={updateQuestionIdx}
                        questions={questions}
                        darkMode={props.darkMode}
                    />
                </div>

                <div className="col-md-4">
                    <BakeButton
                        darkMode={props.darkMode}
                        onClick={questionIdx === questions.length - 1 ? refreshQuestion : () => {}}
                        active={questionIdx === questions.length - 1}>
                        Bake new ECG
                    </BakeButton>
                </div>

                <div className="col-md-4">
                    <ReveiwButton
                        darkMode={props.darkMode}
                        onClick={() => updateDarkTheme(!darkTheme)}>
                        Toggle Theme
                    </ReveiwButton>

                    <Link to={questions.length > 1 ? "/User/ECG" : "/User/ECG/Session"}>
                        <ReveiwButton darkMode={props.darkMode} onClick={props.finishEcgSession}>
                            Finish
                        </ReveiwButton>
                    </Link>
                </div>
            </div>

            <br />
            <br />

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    maxWidth: "800px",
                    margin: "auto",
                }}>
                {questions[questionIdx].sections.map(section => {
                    return questions[questionIdx].answered ? (
                        <ECGAnsweredOptions
                            section={section}
                            darkMode={props.darkMode}
                            handleOptionChange={handleOptionChange}
                        />
                    ) : (
                        <ECGOptions
                            section={section}
                            darkMode={props.darkMode}
                            handleOptionChange={handleOptionChange}
                        />
                    );
                })}
            </div>

            <SubmitButton
                submitPermitted={submitPermitted}
                onClick={submitPermitted ? submitAnswers : () => {}}>
                Submit
            </SubmitButton>
        </Container>
    );
};

export default ECGSession;

// const Container = styled.div<{ darkMode: boolean }>`
//     margin: 50px auto;
//     max-width: 1200px;
//     border-radius: 20px;
//     padding: 0 20px 20px 20px;
//     text-align: center;
// `

const BakeButton = styled.button<{ darkMode: boolean; active: boolean }>`
    display: inline-block;
    border-style: none;
    border-radius: 10px;
    margin: 0 10px 10px 10px;
    width: 200px;
    height: 38px;
    background-color: ${props => (props.darkMode ? "rgba(64, 75, 224, 0.459)" : "#FFC9C9")};
    opacity: ${props => (props.active ? 1 : 0.3)};
    color: ${props => (props.darkMode ? "white" : "black")};
`;

const ReveiwButton = styled.button<{ darkMode: boolean }>`
    display: block;
    border-radius: 10px;
    border: none;
    font-size: 10px;
    margin: 0px auto 2px auto;
    width: 100px;
    padding: 2px 10px;
    background-color: ${props => (props.darkMode ? "rgba(64, 75, 224, 0.459)" : "#FFC9C9")};
    color: ${props => (props.darkMode ? "white" : "black")};
`;

const SubmitButton = styled.button<{ submitPermitted: boolean }>`
    width: 200px;
    margin: 40px auto 0 auto;
    font: bold 20px sans-serif;
    border-radius: 20px;
    border-style: none;
    background-color: ${props => (props.submitPermitted ? "#FAD000" : "grey")};
    display: ${props => (props.submitPermitted ? "inline-block" : "none")};
`;

const NextButton = styled.button<{ active: boolean }>`
    width: 200px;
    margin: 40px auto 0 auto;
    font: bold 20px sans-serif;
    border-radius: 20px;
    border-style: none;
    background-color: ${props => (props.active ? "#FAD000" : "grey")};
`;

const Container = styled.div<{ darkMode: boolean }>`
    max-width: 1200px;
    width: 80%;
    text-align: left;
    margin: 50px auto;
    padding: 30px 3%;
    background-color: none;
    border-radius: 20px;
    min-width: 300px;
    background-color: ${props => (props.darkMode ? "#100A28" : "#FFFFFF")};
    border: 2.5px solid ${props => (props.darkMode ? "#3B2072" : "#FFF4F7")};
    box-shadow: ${props =>
        props.darkMode ? "2px 2px 2px #100A28" : "2px 2px 2px rgba(0, 0, 0, 0.25)"};
`;
