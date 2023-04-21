export default function ComponentWrapperWhite ({children}) {
    return (
        <div className="mt-16 w-full xl:w-2/3 shadow bg-white flex justify-center">
            <div className="w-full xl:w-3/4 grid grid-cols-8">
                {children}
            </div>
        </div>
    )
}
