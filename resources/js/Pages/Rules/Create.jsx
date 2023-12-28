import { useState } from 'react'
import { ErrorNotification, SuccessNotification } from '@/Components/Notifications'
import PendingApproval from '@/Components/Rules/PendingApproval'
import Select from 'react-select'
import TextArea from '@/Components/TextArea'
import Input from '@/Components/Input'

export default function CreateRule({pending, auth, sections, changeRequests, deletions}) {

    const [newRule, setNewRule] = useState('')
    const [createdRules, setCreatedRules] = useState([])
    const [selectedSection, setSelectedSection] = useState('')

    const submitRule = async () => {
        try {
            let res = await axios.post('/rules', {
                section: selectedSection,
                rule: newRule
            })
            setCreatedRules([...createdRules, {rule: res.data.createdRule, sectionTitle: res.data.sectionTitle, sectionNumber: res.data.sectionNumber, id: res.data.ruleId}]) 
            SuccessNotification('Success', res.data.message)            
            setNewRule('')
            setSelectedSection('')
        } catch (error) {
            ErrorNotification('Error', error)
        }
    }

    let sectionOptions = [...sections.map(x => ({label: x.title, value: x.id})), {label: '+ New Section', value: 'newSection'}]
    console.log(deletions)

    return (
        <>
            <div className="lg:w-1/2 w-3/4 flex flex-col items-center">
                <div className="text-2xl">Create Rules</div>
                <div className="flex flex-col w-full">
                    <label htmlFor="section">Section</label>
                    <Select
                        name="section"
                        options={sectionOptions}
                        value={selectedSection}
                        onChange={(e) => selectedSection.value == 'newSection' && e.value == 'newSection' ? '' : setSelectedSection(e)}
                    />
                        
                    {selectedSection.value === 'newSection' &&
                        <>
                            <label htmlFor="newSection">Section Title</label>
                            <Input 
                                name='new-section-title'
                                required={true}
                                handleChange={(e) => setSelectedSection({value: 'newSection', label: e.target.value})}
                            />
                        </>
                    }

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
                {createdRules.length > 0 || pending.length > 0 && <div className="text-xl">New rules pending approval</div>}
                <ul>
                    {createdRules.map(x => (
                        <li key={x.id} className="w-full bg-white flex flex-col mt-4 w-full shadow">
                            <div>{x.sectionTitle} (Section {x.sectionNumber})</div>
                            <div>{x.rule}</div>
                        </li>
                    ))}

                    {pending.map(x => (
                        <li key={x.id} className="w-full bg-white flex flex-col mt-4 w-full shadow">
                            <div className="ml-2">Section {x.rule_section.number}: {x.rule_section.title}</div>
                            <PendingApproval
                                auth={auth}
                                rule={x}
                            />
                        </li>
                    ))}
                </ul>
                {changeRequests.length > 0 && <div className="text-xl mt-4">Rule changes pending approval</div>}
                <ul>
                    {changeRequests.map(x => (
                        <li key={x.id} className="w-full bg-white flex flex-col mt-4 w-full shadow">
                            <div className="ml-2">Section {x.rule_section.number}: {x.rule_section.title}</div>
                            <PendingApproval
                                auth={auth}
                                rule={x}
                                type={'change'}
                            />
                        </li>
                    ))}
                </ul>
                {deletions.length > 0 && <div className="text-xl mt-4">Rule deletions pending approval</div>}
                <ul>
                    {deletions.map(x => (
                        <li key={x.id} className="w-full bg-white flex flex-col mt-4 w-full shadow">
                            <div className="ml-2">Section {x.rule_section.number}: {x.rule_section.title}</div>
                            <PendingApproval
                                auth={auth}
                                rule={x}
                                type={'delete'}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
