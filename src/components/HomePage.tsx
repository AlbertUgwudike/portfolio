import styled from "styled-components";
import { Content, HorizontalScore, Subtitle, Title } from "./Common";
import me from "../assets/me.jpg";
import ecg_thumb from "../assets/ecg_thumb.png";
import { useNavigate } from "react-router";

type HomePageProps = {};

const HomePage = (props: HomePageProps) => {
    const navigate = useNavigate();

    return (
        <>
            <Dashboard>
                <ProfilePic src={me} />
                <Quote>
                    <QuoteBody>Software Engineer.</QuoteBody>
                    <QuoteAccent />
                    <QuoteSubtitle>
                        Enhusiastic MSc Computing student with exeprtise in Medicine, Biomedical and
                        Software Engineering
                    </QuoteSubtitle>
                </Quote>
            </Dashboard>

            <HorizontalScore />

            <Content>
                <br />
                <Title>Projects.</Title>
                <br />

                <ProjectSummary onClick={() => navigate("/ECGSim")}>
                    <Thumbnail src={ecg_thumb} />
                    <DescriptionContent>
                        <Subtitle>ECG Simulator</Subtitle>
                        <Description>
                            In-browser ECG-simulator developed using TypeScript and p5.js. Medical
                            students and practicing clinicians can use this to recreate pahtological
                            ECG traces with abitrary levels of variation. Have a go and play around!
                        </Description>
                    </DescriptionContent>
                </ProjectSummary>
            </Content>
        </>
    );
};

export default HomePage;

const Dashboard = styled.div`
    display: flex;
    padding: 20px;
    justify-content: center;
    align-items: center;
`;

const ProfilePic = styled.img`
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 5px solid var(--secondary);
`;

const Thumbnail = styled.img`
    width: 200px;
    height: 200px;
    border: 5px solid var(--secondary);
    border-radius: var(--border-narrow-radius);
`;

const ProjectSummary = styled.div`
    display: flex;
    padding: 20px;
    background-color: var(--grey);
    margin: 10px auto;
    border-radius: var(--border-narrow-radius);
`;

const Description = styled.div`
    font: var(--md-font);
`;

const DescriptionContent = styled.div`
    margin: 20px;
`;

const Quote = styled.div`
    text-align: center;
    padding: 40px 0;
    margin: 0 50px;
    border-radius: 5px;
    width: 50%;
`;

const QuoteBody = styled.div`
    font: var(--xl-font);
    margin-bottom: 10px;
    color: var(--quarternary);
`;

const QuoteAccent = styled.div`
    width: 50%;
    border: 1px solid black;
    margin: auto;
`;

const QuoteSubtitle = styled.div`
    font: var(--sm-font);
    font-style: italic;
    margin: 10px auto;
    color: var(--text-primary);
    opacity: 75%;
    width: 80%;
`;
