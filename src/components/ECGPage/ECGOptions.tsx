import styled from 'styled-components';

type ECGOptionProps = {
    darkMode: boolean;
    handleOptionChange: (label: string, selected: string) => void;
    section: { label: string, selected: string, correct: string, options: string[] }
}

const ECGOptions = (props: ECGOptionProps) => {
    const backgroundColor = props.darkMode ? "#0D163C" : "#F6F5F0";
        return (
            <div style = {{ margin: "30px auto auto auto", textAlign: "center", whiteSpace: "nowrap", width: "50%", minWidth: "200px" }}>
                <div style = {{ fontSize: "20px", width: "max-content", textAlign: "left", display: "inline-block" }}>{ props.section.label }</div> 
                <Select 
                    backgroundColor = { backgroundColor }
                    textColor = { props.darkMode ? "white" : "black" }
                    onChange = { (e) => props.handleOptionChange(props.section.label, e.target.value) } 
                >       
                        <option value="" disabled selected>Select</option>
                        { props.section.options.map(option => <option>{ option }</option>) }
                        
                </Select> 
            </div>
        )
}

export default ECGOptions;

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