import styled from "styled-components";

type HomePageProps = {}

const HomePage = (props: HomePageProps) => {

    return (
        <>
            <Dashboard>
                <Quote>
                    <QuoteBody>This is a quote</QuoteBody>
                    <QuoteAccent/>
                    <QuoteAuthor>Spoken by me</QuoteAuthor>
                </Quote>
            </Dashboard>
        </>
    )
}

export default HomePage;

const Dashboard = styled.div`
    display: flex;
    padding: 20px;
    justify-content: center;
    align-items: center;
`

const Quote = styled.div`
    max-width: 1000px;
    width: 100%;
    margin: 0px auto;
    padding: 40px 0;
    text-align: center;
    border-radius: 5px;
`

const QuoteBody = styled.div`
    font: var(--xl-font);
    margin-bottom: 10px;
    color: var(--quarternary);
`

const QuoteAccent = styled.div`
    width: 50%;
    border: 1px solid black;
    margin: auto;
`

const QuoteAuthor = styled.div`
    font: var(--md-font);
    font-style: italic;
    margin-top: 10px;
    color: var(--text-primary);
    opacity: 75%;
`
