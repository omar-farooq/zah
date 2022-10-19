import FirstTD from './FirstTD'
import FirstTH from './FirstTH'
import LastTD from './LastTD'
import LastTH from './LastTH'
import TBody from './TBody'
import TD from './TD'
import THead from './THead'
import TH from './TH'

export { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH }

export default function Table({children}) {
    return (
        <div className="mt-4 -mb-3">
            <div className="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]">
                </div>
                <div className="relative rounded-xl overflow-auto">
                    <div className="shadow-sm overflow-hidden my-8">
                        <table className="border-collapse table-auto w-full text-sm">
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
