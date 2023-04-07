export default function PreviewTile({children}) {
    return (
        <div className="xl:w-3/5 flex flex-col items-center bg-white dark:bg-gray-800 py-7 sm:py-0 xl:py-10 px-10 xl:w-3/4">
            {children}
        </div>
    )
}

