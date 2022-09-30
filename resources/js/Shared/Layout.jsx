import React from 'react';
import Nav from './Nav';
import "primereact/resources/themes/tailwind-light/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"

const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <Nav />
            <main className="bg-gray-100">
                {children}
            </main>
        </React.Fragment>
    );
};
export default Layout;
