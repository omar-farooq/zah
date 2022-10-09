import { useEffect } from 'react';

export default function useComponentVisible(ref, callback) {

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			callback();
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

}
