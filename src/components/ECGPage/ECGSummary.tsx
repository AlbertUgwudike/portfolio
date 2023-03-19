import { Link } from "react-router-dom";
import styled from "styled-components";
import BackButton from "./BackButton";
import { EcgTopic } from "./Generator/ECGTypes";

type ECGSummaryProps = {
    topics: EcgTopic[];
    updateTopics: React.Dispatch<React.SetStateAction<EcgTopic[]>>;
    darkMode: boolean;
};

const ECGSummary = (props: ECGSummaryProps) => {
    const selectEcgOption = (name: string) => {
        console.log(props.topics);
        props.updateTopics(
            props.topics.map(topic =>
                topic.name === name ? { ...topic, selected: !topic.selected } : topic
            )
        );
    };

    return (
        <Container darkMode={props.darkMode}>
            <BackButton darkMode={props.darkMode} label="Home" path="/User" />

            <Title darkMode={props.darkMode}>
                <span style={{ color: "#FAD000" }}>ECG</span> Skills Trainer
            </Title>

            <br />
            <br />

            <div style={{ fontSize: "30px", textAlign: "center" }}>Select your prefered topics</div>

            {props.topics.map(topic => {
                return (
                    <OptionButton
                        darkMode={props.darkMode}
                        selected={topic.selected}
                        onClick={() => selectEcgOption(topic.name)}>
                        <span style={{ width: "max-content" }}>{topic.name}</span>

                        <div style={{ display: "inline-block" }}>
                            <span style={{ fontSize: "10px", marginLeft: "10px" }}>
                                Attempts: {topic.attempts}
                            </span>
                            <span style={{ fontSize: "10px", marginLeft: "10px" }}>
                                Correct: {topic.correct}
                            </span>
                        </div>
                    </OptionButton>
                );
            })}

            <div style={{ textAlign: "center" }}>
                {props.topics.filter(topic => topic.selected).length > 0 ? (
                    <Link to="/User/ECG/Session">
                        <StartButton
                            darkMode={props.darkMode}
                            active={true}
                            style={{ marginTop: "50px" }}>
                            <span>Start</span>
                        </StartButton>
                    </Link>
                ) : (
                    <StartButton
                        darkMode={props.darkMode}
                        active={false}
                        style={{ marginTop: "50px" }}>
                        <span>Start</span>
                    </StartButton>
                )}
            </div>
        </Container>
    );
};

export default ECGSummary;

const Title = styled.div<{ darkMode: boolean }>`
    text-align: center;
    font: 50px Champion;
    margin-bottom: 20px;
    margin-top: 20px;
`;

const OptionButton = styled.button<{ darkMode: boolean; selected: boolean }>`
    display: block;
    width: 60%;
    min-width: 275px;
    background-color: ${props =>
        props.selected
            ? props.darkMode
                ? "#1C725C"
                : "#41BFA0"
            : props.darkMode
            ? "#1B275E"
            : "#F6F5F0"};
    color: ${props => (props.darkMode ? "white" : "black")};
    margin: 10px auto 15px auto;
    padding: 10px 20px;
    font: 35px Proxima;
    text-align: left;
    border-radius: 10px;
    border-style: none;
    &:hover {
        background-color: ${props =>
            props.selected
                ? props.darkMode
                    ? "#1C725C"
                    : "#41BFA0"
                : props.darkMode
                ? "#7735FD"
                : "#FBE9EE"};
    }
`;

const StartButton = styled.button<{ darkMode: boolean; active: boolean }>`
    background-color: ${props => (props.active ? "#FAD000" : "grey")};
    padding: 10px;
    color: black;
    font: 30px Proxima;
    border-radius: 10px;
    width: 200px;
    border: none;
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
