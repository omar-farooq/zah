export default function TD({data, children}) {
    return (
        <td className="border-b border-slate-100 px-0 md:px-4 p-4 text-slate-500 dark:text-slate-400 dark:border-slate-700 text-center md:text-left">
            {data}{children}
        </td>
    )
}
