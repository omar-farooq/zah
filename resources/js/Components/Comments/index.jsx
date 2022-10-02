import { useState, useEffect } from 'react'
import CommentBox from './CommentBox'
import CommentDisplay from './CommentDisplay'
import CommentPaginator from './CommentPaginator'
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Comments({model}) {
    const [comments, setComments] = useState('')

    useEffect(() => {
        async function fetchComments() {
            let fetchedComments = await axios.get(window.location.href + '/comments')
            setComments(fetchedComments.data)
        }
        fetchComments()
    },[])
        console.log(comments)
    
    return (
        <>
            <CommentBox model={model} commentHook={[comments, setComments]} />
            {
                comments ?
                <>
                    <CommentDisplay comments={comments.data} />
                    <CommentPaginator commentHook={[comments, setComments]} />
                </>
                :
                    <ProgressSpinner />
            }
        </>
            
    )
}
