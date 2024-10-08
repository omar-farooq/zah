import './bootstrap';
import '../css/app.css';

import React from 'react';
import { render } from 'react-dom';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import Layout from './Shared/Layout.jsx';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : `${appName}`,
    progress: {
        color: '#4B5563'
    },
	
	resolve: async name => {
		const page = await resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
        if(!(name.startsWith('Auth') || name.startsWith('Public'))) {
    		page.default.layout ??= page => <Layout auth={page.props.auth} title={page.props.title}>{page}</Layout>;
        }

		return page;
	},

    setup({ el, App, props }) {
        return render(<App {...props} />, el);
    },
});

