import { PrimeIcons } from 'primereact/api'
export default function LastTD({href, authUserID, author}) {
    return (
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
            {authUserID == author && <a className="pi pi-pencil mr-2" href={`${href}/edit`} />}
            <a className="pi pi-eye" href={href} />
        </td>
    )
}
