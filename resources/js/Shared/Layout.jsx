import React from 'react';
import { NavbarNested } from '@/Components/Nav/Sidebar'
import Topbar from '@/Components/Nav/Topbar'

const Layout = ({ children, auth, title }) => {
    return (
        <React.Fragment>
            <div className="flex flex-row flex-grow">
                <NavbarNested />
                <div className="w-full">
                    <Topbar auth={auth} title={title} />
                    <main className="min-h-screen bg-gray-100 flex flex-col items-center">
                        {children}
                    </main>
                </div>
            </div>
        </React.Fragment>
    );
};
export default Layout;
