import React from 'react';

export default function ApplicationLogo({ className }) {
    return (
        <svg className={className} viewBox="0 0 316 316" xmlns="http://www.w3.org/2000/svg">
            <line x1="00" x2="320" y1="10" y2="10" stroke="black" stroke-width="25"/>
            <line x1="320" x2="00" y1="10" y2="310" stroke="black" stroke-width="25"/>
            <line x1="00" x2="320" y1="310" y2="310" stroke="black" stroke-width="25"/>
        </svg>
    );
}
