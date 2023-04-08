export default function RequestFormButton({text, submitAction}) {
    return (
        <button className="mt-8 border border-transparent hover:border-gray-300 bg-gray-900 hover:bg-white text-white hover:text-gray-900 flex justify-center items-center py-4 rounded w-full dark:bg-white dark:hover:bg-gray-900 dark:text-gray-900 dark:hover:text-white dark:border-transparent" onClick={submitAction}>
            <div>
                <p className="text-base leading-4">{text}</p>
            </div>
        </button>
    )
}
