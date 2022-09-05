export default function ButtonColoured({buttonText, buttonColour, onclick}) {

	return (
		 <button type="button" 
		 			className={`
		 				px-6
						py-2.5
						bg-${buttonColour}-400
						text-white
						font-medium
						text-xs
						leading-tight
						uppercase
						rounded
						shadow-md
						hover:bg-${buttonColour}-600 hover:shadow-lg
						focus:bg-${buttonColour}-700 focus:shadow-lg focus:outline-none focus:ring-0
						active:bg-${buttonColour}-800 active:shadow-lg
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
