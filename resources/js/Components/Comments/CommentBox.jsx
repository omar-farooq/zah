import { useState } from 'react'
import Button from '@/Components/Button'

export default function CommentBox({model, commentHook}) {

    const [textareaValue, setTextareaValue] = useState('')
    const [comments, setComments] = commentHook

    async function handleSubmit(e) {
        e.preventDefault()
        if(textareaValue.length < 3) {
            return
        }
        let res = await axios.post('/comments', {body: textareaValue, commentable_type: model.name, commentable_id: model.id})
        setTextareaValue('')
        setComments(
            {
                ...comments, 
                data: 
                [
                    {
                        body: textareaValue, 
                        id: res.data.user_id, 
                        user: 
                        {
                            name: res.data.user_name
                        }
                    }, 
                    ...comments.data
                ]
            }
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mt-6 mb-6 flex flex-col">
                    Make a comment
                    <textarea value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} />
                    <Button>add comment </Button>
                </div>
            </form>
        </>
    )
}
