import { Fragment, useState } from 'react'
import { Panel } from 'primereact/panel'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
export default function Roles({members}) {

    const roles = [
        {value: 'Treasurer', label: 'Treasurer'}, 
        {value: 'Chair', label: 'Chair'}, 
        {value: 'Secretary', label: 'Secretary'}
    ]

    const memberDropdownOptions = members.map(member => ({
        value: member.id,
        label: member.name,
        role: member.role?.name
    }))

    const [selectedRoles, setSelectedRoles] = useState([])
    const [nominatedTreasurer, setNominatedTreasurer] = useState('')
    const [nominatedSecretary, setNominatedSecretary] = useState('')
    const [nominatedChair, setNominatedChair] = useState('')

    return (
        <>
            <Table>
                <THead>
                    <FirstTH heading="Name" />
                    <TH heading="Role" />
                    <TH heading="Delegated Role" />
                    <LastTH />
                </THead>
                <TBody>
                    {members.map(member =>
                        <Fragment key={member.id}>
                            <tr>
                                <FirstTD data={member.name} />
                                <TD data={member.role? member.role['name'] : ''} />
                                <TD data={member.delegated_role? member.delegated_role['name'] : ''} />
                            </tr>
                        </Fragment>
                    )}
                </TBody>
            </Table>

            <Panel header="Reassign Roles" toggleable collapsed='false'>
                <p>Select roles to reassign</p>
                <MultiSelect display="chip" options={roles} value={selectedRoles} onChange={(e) => setSelectedRoles(e.value)} />
                
                {selectedRoles.find(x => x == 'Treasurer') &&
                    <Dropdown 
                        placeholder="Nominate Treasurer" 
                        options={memberDropdownOptions.filter(option => option.role != "Treasurer")} 
                        value={nominatedTreasurer} 
                        onChange={(e) => setNominatedTreasurer(e.value)} 
                    />
                }

                {selectedRoles.find(x => x == 'Chair') &&
                    <Dropdown 
                        placeholder="Nominate Chair" 
                        options={memberDropdownOptions.filter(option => option.role != "Chair")} 
                        value={nominatedChair} 
                        onChange={(e) => setNominatedChair(e.value)} 
                    />
                }

                {selectedRoles.find(x => x == 'Secretary') &&
                    <Dropdown 
                        placeholder="Nominate Secretary" 
                        options={memberDropdownOptions.filter(option => option.role != "Secretary")} 
                        value={nominatedSecretary} 
                        onChange={(e) => setNominatedSecretary(e.value)} 
                    />
                }

            </Panel>
        </>

    )
}
