import { Fragment, useReducer, useState } from 'react'
import { ErrorNotification, SuccessNotification } from '@/Components/Notifications'
import { Link } from '@inertiajs/inertia-react'
export default function Rules({ruleSections}) {
    const [editorMode, setEditorMode] = useState(false)
    const [ruleToEdit, setRuleToEdit] = useState('')

    const initialState = ruleSections

    function reducer(reactiveRules, action) {
        switch (action.type) {
            case 'update':
                return reactiveRules.reduce((a,section) => {
                    if(section.number === ruleToEdit.rule_section_id) {
                        return [...a, {...section, rules: [...section.rules.filter(y => y.id != ruleToEdit.id), {...section.rules.find(y => y.id === ruleToEdit.id), rule: action.rule, rule_change: {present: true}}]}]
                    } else {
                        return [...a, section]
                    }
                    return a
                }, [])
                //return [...reactiveRules.filter(x => x.number != ruleToEdit.rule_section_id), {...reactiveRules.find(x => x.number === ruleToEdit.rule_section_id), rules: [...reactiveRules.find(x => x.number === ruleToEdit.rule_section_id).rules.filter(y => y.id != ruleToEdit.id), {...reactiveRules.find(x => x.number === ruleToEdit.rule_section_id).rules.find(y => y.id == ruleToEdit.id), rule: action.rule}] }]
            case 'delete':
                return reactiveRules
            default:
                throw new Error();
        }
    }

    const [reactiveRules, dispatch] = useReducer(reducer, initialState)

    const saveChanges = async () => {
        try {
            let res = await axios.post('/rule-change', {
                rule: ruleToEdit.rule,
                rule_id: ruleToEdit.id
            })
            SuccessNotification('Success', res.data.message)
            await dispatch({type: 'update', rule: ruleToEdit.rule})
            setRuleToEdit('')

        } catch (error) {
            ErrorNotification('Error', error)
        }
    }

    return (
        <>
            <Link href={route('rules.create')} className="rounded my-4 text-sky-600 text-2xl">Click here to add and review new rules</Link>

            <ul className="w-3/4 bg-white shadow px-3 py-2">
                <button onClick={() => setEditorMode(!editorMode)}>Editor Mode</button>
                <div className="text-2xl mb-3">Rules</div>
                {reactiveRules.map(section => (
                    <ul key={section.id} className="mb-4">
                        <div className="text-xl">Section {section.number} - {section.title}</div>
                            {section.rules.map(x => (
                                <Fragment key={x.id}>
                                    <li onClick={() => editorMode && setRuleToEdit(x)}>
                                        {section.number}.{x.number}: {ruleToEdit.id == x.id && !ruleToEdit.rule_changes.length > 0 ? 
                                            <>
                                                <br />
                                                <textarea defaultValue={x.rule} onChange={(e) => setRuleToEdit({...ruleToEdit, rule: e.target.value})} />
                                            </> 
                                            : x.rule}
                                        {editorMode && x.rule_changes.length > 0 ? <span className="text-orange-600 ml-2">under review</span> : ''}
                                    </li>
                                    <div className={`flex space-x-1.5 ${(ruleToEdit.id != x.id) || x.rule_changes.length > 0 ? 'hidden' : 'visible'}`}>
                                        <button onClick={() => saveChanges()}>save</button> 
                                        <button onClick={() => setRuleToEdit('')}>cancel</button>
                                    </div>
                                </Fragment>
                            ))}
                    </ul>
                ))}
            </ul>
        </>
    )
}
