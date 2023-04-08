export default function ComponentTitle({children, bg}) {
    return (
        <div className={`text-xl col-start-1 lg:col-start-3 md:col-end-5 col-end-9 text-white flex justify-center ${bg}`}>{children}</div>
    )
}
