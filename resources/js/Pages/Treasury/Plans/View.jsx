import { Fragment } from 'react'
import { Link } from '@inertiajs/inertia-react';
import { DateToUKLocale } from '@/Shared/Functions'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
export default function ViewPlan({treasuryPlan}) {

    return (
        <>
            <div className="grid grid-cols-6 bg-white m-4 shadow-md text-md">
                <span className="m-2 font-bold col-span-2">Plan Created:</span><span className="mt-2">{DateToUKLocale(treasuryPlan.created_at)}</span>
                <span className="m-2 font-bold col-span-2"></span><span className="mt-2"></span>
                <span className="m-2 font-bold col-span-2">Expected incoming (5 years):</span> <span className="mt-2">£{treasuryPlan.expected_incoming}</span>
                <span className="m-2 font-bold col-span-2">Expected outgoing (5 years):</span> <span className="mt-2">£{treasuryPlan.expected_outgoing}</span>
                <span className="m-2 font-bold col-span-2">Available balance:</span> <span className="mt-2">£{treasuryPlan.available_balance}</span>
                <span className="m-2 font-bold col-span-2">Expected 5 year balance:</span><span className="mt-2"> £{treasuryPlan.expected_balance}</span>
            </div>

            <table>
                <thead className="text-slate-700 font-bold text-left">
                    <tr>
                        <th></th>
                        <th>Priority</th>
                        <th>Component</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                        {treasuryPlan.plan_components.map(component => (
                            <Fragment key={component.id}>
                    <tr>
                                <td className="bg-white w-16"><EllipsisHorizontalIcon className="h-6 w-6 text-slate-400 mx-auto" /></td>
                                <td className="bg-white w-20">{component.pivot.priority}</td>
                                <td className="bg-white w-36">{component.component}</td>
                                <td className="bg-white w-24">{component.cost}</td>
                    </tr>
                            </Fragment>
                        ))}
                </tbody>
            </table>

            <div className="m-6 text-xl">
                Estimated Remaining Balance: £{treasuryPlan.estimated_remaining_balance} 
            </div>

            <Link 
                href={route('treasury-plans.create')}
                className="bg-sky-600 hover:bg-sky-700 text-white text-lg border rounded-lg w-52 h-10 text-center py-1"
            >
                Create Treasury Plan
            </Link>
            <Link 
                href={route('treasury-plans.index')}
                className="bg-sky-600 hover:bg-sky-700 text-white text-lg border rounded-lg w-52 h-10 text-center mt-4 py-1"
            >
                View all plans
            </Link>
        </>
    )
}
