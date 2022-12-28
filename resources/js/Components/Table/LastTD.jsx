import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline'
import { InertiaLink } from '@inertiajs/inertia-react'

export default function LastTD({href, authUserID, author, itemID, children}) {
    return (
        <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400 flex flex-row">
            {children}
            {author && authUserID == author && 
                <InertiaLink href={route(href + '.edit', itemID)}>
                    <PencilSquareIcon className="w-6 h-6 mr-2" />
                </InertiaLink>
            }

            <InertiaLink href={route(href + '.show', itemID)}>
                <EyeIcon className="w-6 h-6" />
            </InertiaLink>
        </td>
    )
}
