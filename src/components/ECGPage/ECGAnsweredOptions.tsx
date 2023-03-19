import styled from 'styled-components';

type ECGOptionProps = {
    darkMode: boolean;
    handleOptionChange: (label: string, selected: string) => void;
    section: { label: string, selected: string, correct: string  }
}

const ECGAnsweredOptions = (props: ECGOptionProps) => {
    const backgroundColor = props.section.correct === props.section.selected ? "#1C725C" : "#A94D53";

    return (
        <div style = {{ margin: "30px auto auto auto", textAlign: "center", whiteSpace: "nowrap", width: "50%", minWidth: "200px" }}>
            <div style = {{ fontSize: "20px", width: "max-content", textAlign: "left", display: "inline-block" }}>{ props.section.label }</div> 
            <Select 
                backgroundColor = { backgroundColor }
                textColor = "black"
                onChange = { (e) => props.handleOptionChange(props.section.label, e.target.value) } 
            >       
                    <option value="" selected>{ props.section.selected }</option>
                    
            </Select> 
            {
                props.section.correct !== props.section.selected
                    ?   <Select backgroundColor = "#1C725C" textColor = "black" style = {{ display: "block", float: 'right' }}>
                            <option value = "" selected>{ props.section.correct }</option>
                        </Select>
                    :   <Select backgroundColor = "transparent" textColor = "black" style = {{ display: "block", float: 'right' }}>
                        </Select>
            } 
        </div>
    )
}

export default ECGAnsweredOptions;

const Select = styled.select<{ backgroundColor: string, textColor: string }>`
    border-radius: 20px;
    margin: 5px 10px;
    padding: 3px 15px;
    min-width: 100px;
    width: 60%;
    background-color: ${ props => props.backgroundColor };
    color: ${ props => props.textColor };
    border: none;
`