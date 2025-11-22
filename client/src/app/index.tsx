import '@/app/styles/index.css';
import '@/app/styles/normalize.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './providers';
import { Router } from './router/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
        <Providers>
            <Router />
        </Providers>
	</React.StrictMode>
);