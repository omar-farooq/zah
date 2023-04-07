export default function Form({children, onSubmit}) {
    return (
        <form onSubmit={onSubmit} className="col-start-3 col-end-7 flex flex-col items-center">
            {children}
        </form>
    )
}
