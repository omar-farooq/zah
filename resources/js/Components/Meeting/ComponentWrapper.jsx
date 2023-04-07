export default function ComponentWrapper ({children}) {
    return (
        <div className="mt-10 w-full grid grid-cols-8">
            {children}
        </div>
    )
}
