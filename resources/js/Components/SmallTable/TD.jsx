export default function TD({data, children}) {
    return (
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
            {data}{children}
        </td>
    )
}
