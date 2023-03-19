import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type BackButtonProps = {
    darkMode: boolean;
    path: string;
    label: string;
}


const BackButton = (props: BackButtonProps) => {

    return (
        <Link to = { props.path } >
            <Button darkMode = { props.darkMode }>
                <FaArrowLeft /> { props.label }
            </Button>
        </Link>
    )

}

export default BackButton

const Button = styled.button<{ darkMode: boolean }>`
    position: relative;
    top: 0;
    left: 0;
    background-color: transparent;
    color: ${ props => props.darkMode ? "grey" : "black" };
    font-size: 12px;
    border: none;
`