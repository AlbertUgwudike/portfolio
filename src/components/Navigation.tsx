import { Link } from "react-router-dom";
import styled from "styled-components";
import { HorizontalScore } from "./Common";

const Navigation = () => {
    return (
        <>
            <Nav>
                <Link to="/">
                    <NavTitle>Albert Ugwudike</NavTitle>
                </Link>

                <NavOptions>
                    <Link to="/">
                        <NavOption>CV</NavOption>
                    </Link>
                    <Link to="/">
                        <NavOption>Projects</NavOption>
                    </Link>
                    <Link to="/">
                        <NavOption>Research</NavOption>
                    </Link>
                </NavOptions>
            </Nav>

            <HorizontalScore />
        </>
    );
};

export default Navigation;

const Nav = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    max-width: 1000px;
    margin: 0px auto;
    padding: 10px;

    justify-content: space-between;
    z-index: 1000;
`;

const NavTitle = styled.div`
    padding-left: 20px;
    text-decoration: none;
    color: var(--secondary);
    font: var(--bg-font);
    font-weight: bold;
`;

const NavOptions = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
`;

const NavOption = styled.div`
    text-decoration: none;
    padding: 0.25em 0.5em;
    margin: 0 0.5em;
    border-radius: 0.3em;
    color: var(--secondary);
    font: var(--button-font);
    transition: background-color 0.2s;
`;
