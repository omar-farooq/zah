import { useState } from 'react'
import { Pagination } from '@mantine/core'

export default function CommentPaginator({commentHook}) {

    const [comments, setComments] = commentHook

    async function pageChange (e) {
        let link = comments.links.find(x => x.label == e).url
        let res = await axios.get(link)
        setComments(res.data)
    }

    return (
        comments.data.length == 0  ? <div>No comments yet. Be the first to comment</div> : 
        <Pagination 
            total={comments.last_page} 
            color="default" 
            size="lg" 
            radius="xs" 
            onChange={(e) => pageChange(e)} 
            position="center"
        />
    )
}
