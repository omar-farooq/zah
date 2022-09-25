import Button from '@/Components/Button'

export default function CommentBox() {
    return (
        <>
            <div className="mt-6 mb-6 flex flex-col">
                Make a comment
                <textarea />
                <Button>add comment</Button>
            </div>
        </>
    )
}
