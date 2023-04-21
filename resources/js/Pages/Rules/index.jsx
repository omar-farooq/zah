import { Link } from '@inertiajs/inertia-react'
export default function Rules() {
    return (
        <Link href={route('rules.create')}>Add a new rule</Link>
    )
}
