export default function ButtonColoured({buttonText, bgcolour, hovercolour, activecolour, focuscolour, onclick}) {

	return (
		 <button type="button" 
		 			className={`
		 				px-6
						py-2.5
						${bgcolour}
						text-white
						font-medium
						text-xs
						leading-tight
						uppercase
						rounded
						shadow-md
						${hovercolour} hover:shadow-lg
						${focuscolour} focus:shadow-lg focus:outline-none focus:ring-0
						${activecolour} active:shadow-lg
						transition
						duration-150
						ease-in-out
						ml-1
					`}
					onClick={onclick}
		>
			{buttonText}
		</button>
	)
}
