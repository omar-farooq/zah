export default function ComponentTitle({children, bg}) {
    return (
        <div className={`text-xl lg:text-2xl col-start-1 md:col-end-5 col-end-9 text-white flex justify-center -mt-3 lg:-mt-4 ${bg}`}>{children}</div>
    )
}
