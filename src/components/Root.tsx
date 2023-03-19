import { Outlet } from 'react-router';
import Navigation from './Navigation';

const Root = () => {

    return (
        <>
            <Navigation />
            <Outlet />
        </>
    )
}

export default Root;