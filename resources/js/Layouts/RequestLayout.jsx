export function FlexAlignLeft({children}) {
    return (
        <div className="flex flex-col justify-start items-start w-full space-y-4">
            {children}
        </div>
    )
}

export function FormLabel({children}) {
    return (
       <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">
           {children}
       </label> 
    )
}

export function FormTile({children, position}) {
    return (
        <div className={`p-8 bg-white dark:bg-gray-800 flex flex-col lg:w-full xl:w-3/5 ${position == 'centre' ? 'm-auto' : ''}`}>
            {children}
        </div>
    )
}

export function HiddenCurrencyInput({amount}) {
    return (
        amount == '' ? '' : <input value="£" disabled className="absolute mt-4 ml-1.5 w-3" />
    )
}


export function InputContainer({children}) {
    return (
        <div className="mt-2 flex-col">
            {children}
        </div>
    )
}

export function PreviewImageContainer({children}) {
    return (
        <div className="mt-6 sm:mt-0 xl:my-10 xl:px-20 w-52 sm:w-96 xl:w-auto">
            {children}
        </div>
    )
}

export function PreviewTile({children}) {
    return (
        <div className="xl:w-3/5 flex flex-col sm:flex-row xl:flex-col justify-center items-center bg-white dark:bg-gray-800 py-7 sm:py-0 xl:py-10 px-10 xl:w-full">
            {children}
        </div>
    )
}

export function RequestLayout({children}) {
    return (
        <div className="w-full">
            <div className="py-16 px-4 md:px-6 2xl:px-0 flex justify-center items-center 2xl:mx-auto 2xl:container">
                <div className="flex flex-col justify-start items-start w-full space-y-9">
                        {children}
                </div>
            </div>
        </div>
    )
}

export function RequestName({name}) {
    return (
        <p className="text-xl md:text-2xl leading-normal text-gray-800 dark:text-gray-50">{name}</p>
    )
}

export function ShowErrors({children}) {
    return (
        <div className='text-red-600'>
            {children}
        </div>
    )
}

export function Source({link}) {
    return (
            link && link.includes('http') ?
                <a href={`${link}`} target="_blank" className="text-base font-semibold leading-none text-gray-600 dark:text-white">View Source</a>
            : link ?
                <a href={`//${link}`} target="_blank" className="text-base font-semibold leading-none text-gray-600 dark:text-white">View Source</a>
            :
                ''
    )
}

export function TileContainer({children}) {
    return (
        <div className="flex flex-col xl:flex-row justify-center xl:justify-between space-y-6 xl:space-y-0 xl:space-x-6 w-full">
            {children}
        </div>
    )
}

export function Title({children, position}) {
    return (
        <div className={`flex justify-start flex-col items-start space-y-2 ${position == 'centre' ? 'm-auto' : ''}`}>
            <p className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800 dark:text-gray-50">{children}</p>
        </div>
    )

}
