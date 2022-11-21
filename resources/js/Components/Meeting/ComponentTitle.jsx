export default function ComponentTitle({children, bg}) {
    return (
        <div className={`text-xl col-start-3 col-end-5 text-white flex justify-center ${bg}`}>{children}</div>
    )
}
