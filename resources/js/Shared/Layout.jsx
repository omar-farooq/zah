import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { NavbarNested } from '@/Components/Nav/Sidebar'
import Topbar from '@/Components/Nav/Topbar'

const Layout = ({ children, auth, title }) => {
    return (
        <React.Fragment>
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <Notifications />
                <div className="flex flex-row flex-grow">
                    <div className="hidden lg:flex">
                        <NavbarNested />
                    </div>
                    <div className="w-full">
                        <main className="min-h-screen bg-gray-100 flex flex-col items-center">
                            <Topbar auth={auth} title={title} />
                            {children}
                        </main>
                    </div>
                </div>
            </MantineProvider>
        </React.Fragment>
    );
};
export default Layout;
