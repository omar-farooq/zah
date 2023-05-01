import { useState } from 'react'
import { ErrorNotification, SuccessNotification } from '@/Components/Notifications'
import PendingApproval from '@/Components/Rules/PendingApproval'
import TextArea from '@/Components/TextArea'

export default function CreateRule({pending, auth}) {

    const [ruleNumber, setRuleNumber] = useState('')
    const [newRule, setNewRule] = useState('')
    const [createdRules, setCreatedRules] = useState([])

    const submitRule = async () => {
        try {
            let res = await axios.post('/rules', {
                rule_number: ruleNumber,
                rule: newRule
            })
            console.log(res.data)
            setCreatedRules([...createdRules, res.data.createdRule]) 
            SuccessNotification('Success', res.data.message)            
            setNewRule('')
            setRuleNumber('')
        } catch (error) {
            ErrorNotification('Error', error)
        }
    }
    return (
        <>
            <div className="lg:w-1/2 w-3/4 flex flex-col items-center">
                <div className="text-2xl">Create Rules</div>
                <div className="flex flex-col w-full">
                    <label htmlFor="rule-number">Rule Number</label>
                    <input
                        type='number'
                        step="0.01"
                        value={ruleNumber}
                        onChange={(e) => setRuleNumber(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="rule">Rule</label>
                    <TextArea
                        className="h-28 w-full"
                        value={newRule}
                        handleChange={(e) => setNewRule(e.target.value)}
                    />
                </div>
                <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4" onClick={submitRule}>Submit</button>
            </div>

            <div className="lg:w-1/2 w-5/6 mt-4">
                {createdRules.length > 0 || pending.length > 0 && <div className="text-xl">Rules pending approval</div>}
                <ul>
                    {createdRules.map(x => (
                        <li key={x.id} className="w-full bg-white flex flex-row space-x-3 mt-4 w-full shadow">
                            <div>{x.rule_number}</div>
                            <div>{x.rule}</div>
                        </li>
                    ))}

                    {pending.map(x => (
                        <li key={x.id} className="w-full bg-white flex flex-row space-x-3 mt-4 w-full shadow">
                            <PendingApproval
                                auth={auth}
                                rule={x}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
