import { Fragment } from 'react'
import { DateTimeToUKLocale } from '@/Shared/Functions'

export default function CommentDisplay({comments}) {
	return (
        comments.map(comment => (
            <Fragment key={comment.id}>
                <div className="flex justify-center relative">
                    <div className="relative grid grid-cols-1 gap-4 p-4 mb-8 border rounded-lg bg-white shadow-lg w-5/6">
                        <div className="relative flex gap-4">
                            <img src={`/users/${comment.user.id}?view=avatar`} className="relative rounded-lg -top-8 -mb-4 bg-white border h-20 w-20" alt="" loading="lazy" />
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row justify-between">
                                    <p className="relative text-xl whitespace-nowrap truncate overflow-hidden">{comment.user['name']}</p>
                                    <a className="text-gray-500 text-xl" href="#"><i className="fa-solid fa-trash"></i></a>
                                </div>
                                <p className="text-gray-400 text-sm">{comment.created_at ? DateTimeToUKLocale(comment.created_at) : "Just Now"}</p>
                            </div>
                        </div>
                        <p className="-mt-4 text-gray-500">{comment.body}</p>
                    </div>
                </div>
            </Fragment>
        )) 
	)
}
