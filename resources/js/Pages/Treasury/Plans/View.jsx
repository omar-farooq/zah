import { Fragment } from 'react'
import { Link } from '@inertiajs/inertia-react';
import { DateToUKLocale } from '@/Shared/Functions'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
export default function ViewPlan({treasuryPlan}) {

    return (
        <>
            <div className="grid grid-cols-4 md:grid-cols-6 bg-white md:m-4 mt-4 shadow-md text-sm md:text-base justify-items-end md:justify-items-center">
                <span className="m-2 font-bold col-span-2">Plan Created:</span><span className="mt-2 -ml-3 sm:ml-0 justify-self-end md:justify-self-center">{DateToUKLocale(treasuryPlan.created_at)}</span>
                <span className="m-2 font-bold col-span-2">Created by:</span><span className="mt-2 -ml-3 sm:ml-0 justify-self-end md:justify-self-center">{treasuryPlan.user.name}</span>
                <span className="m-2 font-bold col-span-2">Expected incoming (5 years):</span> <span className="mt-2 -ml-3 sm:ml-0 justify-self-end md:justify-self-center">£{treasuryPlan.expected_incoming}</span>
                <span className="m-2 font-bold col-span-2">Expected outgoing (5 years):</span> <span className="mt-2 -ml-3 sm:ml-0 justify-self-end md:justify-self-center">£{treasuryPlan.expected_outgoing}</span>
                <span className="m-2 font-bold col-span-2">Available balance:</span> <span className="mt-2 -ml-3 sm:ml-0 justify-self-end md:justify-self-center">£{treasuryPlan.available_balance}</span>
                <span className="m-2 font-bold col-span-2">Expected balance (5 years):</span><span className="mt-2 -ml-3 sm:ml-0 justify-self-end md:justify-self-center"> £{treasuryPlan.expected_balance}</span>
            </div>

            <table className="xl:w-2/3">
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
                    <tr className="xl:text-xl">
                                <td className="bg-white w-16"><EllipsisHorizontalIcon className="h-6 w-6 text-slate-400 mx-auto" /></td>
                                <td className="bg-white w-20">{component.pivot.priority}</td>
                                <td className="bg-white w-36">{component.component}</td>
                                <td className="bg-white w-24">{component.cost}</td>
                    </tr>
                            </Fragment>
                        ))}
                </tbody>
            </table>

            <div className="m-6 md:text-xl">
                Estimated Remaining Balance: £{treasuryPlan.estimated_remaining_balance} 
            </div>

            <Link 
                href={route('treasury-plans.create')}
                className="bg-pink-700 hover:bg-pink-800 text-white text-md border rounded-md w-52 h-9 text-center p-2 flex"
            >
                <span className="w-full self-center justify-center">Create Treasury Plan</span>
            </Link>
            <Link 
                href={route('treasury-plans.index')}
                className="bg-sky-600 hover:bg-sky-700 text-white text-md border rounded-md w-52 h-9 text-center mt-2 p-2 flex"
            >
                <span className="w-full self-center">View all plans</span>
            </Link>
        </>
    )
}
