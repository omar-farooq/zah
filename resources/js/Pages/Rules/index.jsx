import { Link } from '@inertiajs/inertia-react'
export default function Rules({rules}) {
    return (
        <>
            <Link href={route('rules.create')} className="rounded my-4 text-sky-600 text-2xl">Click here to add and review new rules</Link>

            <ul className="w-3/4 bg-white shadow px-3 py-2">
                <div className="text-2xl mb-3">Rules</div>
                {rules.map(x => (
                    <li key={x.id} className="mb-4">
                        <div className="text-xl">{x.rule_number}</div>
                        <div>{x.rule}</div>
                    </li>
                ))}
            </ul>
        </>
    )
}
