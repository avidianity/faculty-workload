import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import { v4 } from 'uuid';
import './App.css';
import { views } from './routes';

const Router: any = process.env.REACT_APP_IS_ELECTRON ? HashRouter : BrowserRouter;

const queryClient = new QueryClient();

function App() {
	useEffect(() => {
		const urls = [`${process.env.REACT_APP_IS_ELECTRON ? '.' : ''}/assets/scripts/main.js`];
		const id = v4();

		const scripts = urls.map((url) => {
			const script = document.createElement('script');

			script.id = id;
			script.src = url;

			return script;
		});

		document.body.append(...scripts);

		return () => {
			document.getElementById(id)?.remove();
		};
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Switch>
					{views.map((view, index) => (
						<Route {...view} key={index} />
					))}
				</Switch>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
