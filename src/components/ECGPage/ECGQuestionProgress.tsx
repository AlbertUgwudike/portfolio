import styled from 'styled-components';
import { EcgQuestion } from "./Generator/ECGTypes";

type ECGProgressProps = {
    updateQuestionIdx: React.Dispatch<React.SetStateAction<number>>;
    questionIdx: number;
    questions: EcgQuestion[];
    darkMode: boolean;
}

const ECGQuestionProgress = (props: ECGProgressProps) => {

    const backButtonActive = props.questionIdx > 0;
    const forwadButtonActive = props.questionIdx < props.questions.length - 1;

    const [backButtonColor, backButtonFunc] = backButtonActive ? ["#FAD000", () => props.updateQuestionIdx(i => i - 1)] : ["grey", () => {}];
    const [forwardButtonColor, forwardButtonFunc] = forwadButtonActive ? ["#FAD000", () => props.updateQuestionIdx(i => i + 1)] : ["grey", () => {}];

    return (
        <Container darkMode = { props.darkMode }> 

            <Button 
                backgroundColor = { backButtonColor }
                textColor = { props.darkMode ? "white" : "black" }
                onClick = { backButtonFunc }
            > 
                &lt; 
            </Button>

            <Dosset>
                { 
                    Array(props.questions.length).fill(0).map((_, idx) => {
                        const correct = props.questions[idx].sections.reduce((flag, section) => flag && section.selected === section.correct, true);
                        let backgroundColor = "grey";
                        if (correct && props.questions[idx].answered) backgroundColor = "green";
                        if (!correct && props.questions[idx].answered) backgroundColor = "red";

                        return <Pill backgroundColor = { backgroundColor } darkMode = { props.darkMode } selected = { idx === props.questionIdx } />
                    }) 
                }
            </Dosset>

            <Button 
                backgroundColor = { forwardButtonColor }
                textColor = { props.darkMode ? "white" : "black" }
                onClick = { forwardButtonFunc }
            > 
                &gt;
            </Button>

        </Container> 
    );
}

export default ECGQuestionProgress;

const Container = styled.div<{ darkMode: boolean }>`
    display: inline-block;
    border-radius: 10px;
    border: none;
    font-size: 24px;
    margin: 0 10px 5px 10px;
    padding: 0 10px;
    background-color: ${ props => props.darkMode ? "rgba(64, 75, 224, 0.459)" : "#FFC9C9" };
    color: ${ props => props.darkMode ? "white" : "black" };
`

const Button = styled.button<{ backgroundColor: string, textColor: string }>`
    display: inline-block;
    border-style: none;
    background-color: transparent;
    color: ${ props => props.textColor };
`

const Dosset = styled.div`
    display: inline-block;
    white-space: wrap;
    text-align: center;
`

const Pill  = styled.div<{ backgroundColor: string, darkMode: boolean, selected: boolean }>`
    display: inline-block;
    height: 16px;
    width: 16px;
    border-radius: 8px;
    border: 1px solid ${ props => props.selected ? "white" : "transparent" };
    margin: 0px 2px;
    background-color: ${ props => props.backgroundColor}
`