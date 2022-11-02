import React from 'react';
import ReactGA from 'react-ga';
import { useLocation } from 'react-router-dom';

interface AnalyticsProps {
	trackingId: string;
}

export const Analytics = ({ trackingId }: AnalyticsProps) => {
	const location = useLocation();

	React.useEffect(() => {
		ReactGA.initialize(trackingId);
	}, [trackingId])

	React.useEffect(() => {
		console.log('location', location)
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, [location]);

	return null;
}
