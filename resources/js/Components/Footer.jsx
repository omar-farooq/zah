export default function Footer() {
    return (
        <>
            <footer className="h-60 bg-zinc-100 md:-skew-y-1 text-slate-500">
                <div className="flex justify-center">
                    <div className="flex flex-col lg:flex-row w-3/5 mt-3">

                        <div className="w-full lg:w-1/3 text-center">
                            <h3 className="text-2xl mb-1 text-slate-600">Resources</h3>
                            <div class="flex flex-col">
                            <a href="/complaints">Zah complaints policy</a>
                            <a href="https://www.ica.coop/en" target="_blank">International Cooperative Alliance</a>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 mt-6 lg:mt-0 text-center">
                            <h3 className="text-2xl mb-1 text-slate-600">UK Social Housing</h3>
                            <a href="https://diggersanddreamers.org.uk/" target="_blank">Diggers and Dreamers</a>
                        </div>

                        <div className="w-full lg:w-1/3 mt-6 lg:mt-0 text-center">
                            <h3 className="text-2xl text-slate-600">Manchester</h3>
                        </div>

                    </div>
                </div>
            </footer>
        </>
    )
}
