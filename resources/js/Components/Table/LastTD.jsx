import { ChatBubbleBottomCenterTextIcon, PencilSquareIcon, EyeIcon, FolderArrowDownIcon } from '@heroicons/react/24/outline'
import { useDisclosure } from '@mantine/hooks'
import CommentDrawer from '@/Components/Comments/CommentDrawer'
import { InertiaLink } from '@inertiajs/inertia-react'

export default function LastTD({href, authUserID, author, itemID, children, model, commentRoute, file=false}) {
    
    const [opened, { open, close }] = useDisclosure(false)

    return (
        <td className="border-b border-slate-100 p-4 pr-8 text-slate-500 flex flex-row justify-center dark:border-slate-700 dark:text-slate-400">
            {children}

                {
                    file ?
                        <a href={`/documents/${itemID}`}><FolderArrowDownIcon className="w-6 h-6 text-yellow-800 hover:text-yellow-950" /></a>
                    :
                        <InertiaLink href={route(href + '.show', itemID)}>
                            <EyeIcon className="w-6 h-6 text-cyan-600 hover:text-cyan-700" />
                        </InertiaLink>
                }

            {author && authUserID == author && 
                <InertiaLink href={route(href + '.edit', itemID)}>
                    <PencilSquareIcon className="w-6 h-6 mr-2 text-teal-600 hover:text-teal-700 ml-1" />
                </InertiaLink>
            }

            {commentRoute &&
                <>
                <ChatBubbleBottomCenterTextIcon onClick={open} className="w-6 h-6 mr-2" />
                <CommentDrawer
                    openHook={[opened, {open,close}]}
                    model={model}
                    commentRoute={commentRoute}
                />
                </>
            }
        </td>
    )
}
