import React from 'react';
import { Link } from '@inertiajs/react';

export default function NavLink({ href, active, children, className }) {
    return (
        <Link
            href={href}
            className={className}
        >
            {children}
        </Link>
    );
}
