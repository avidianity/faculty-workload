import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { v4 } from 'uuid';
import './App.css';
import { views } from './routes';

const queryClient = new QueryClient();

function App() {
	useEffect(() => {
		const urls = ['/assets/scripts/main.js'];
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
