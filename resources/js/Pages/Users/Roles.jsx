import { Fragment, useReducer } from 'react'
import { Accordion } from '@mantine/core'
import RoleNomination from '@/Components/RoleNomination'
import Select from 'react-select'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'
export default function Roles({members, nominations, auth}) {

    const roles = [
        {id: 1, value: 'Chair', label: 'Chair'}, 
        {id: 2, value: 'Treasurer', label: 'Treasurer'}, 
        {id: 3, value: 'Secretary', label: 'Secretary'}
    ]

    const memberDropdownOptions = members.map(member => ({
        value: member.id,
        label: member.name,
        role: member.role?.name
    }))

    function reducer(state, action) {
        switch(action.type) {
            case 'assignRole':
                return state.map((role) => {
                    if (role.role_id == action.roleId) {
                        return {...role, user_id: action.userId}
                    } else {
                        return role
                    }
                })
            case 'removeRole':
                return state.map((role) => {
                    if (role.role_id == action.roleId) {
                        return {...role, user_id: ''}
                    } else {
                        return role
                    }
                })
            default:
                throw new Error();
        }
    }

    const initialRoleAssignment = [
        {role_id: 1, user_id: ''},
        {role_id: 2, user_id: ''},
        {role_id: 3, user_id: ''},
    ]

    const [roleAssignment, dispatch] = useReducer(reducer, initialRoleAssignment)

    const handleSubmit = (e) => {
        e.preventDefault()
        roleAssignment.forEach(role => 
            role.user_id != '' 
            ? axios.post('/role-assignment', role)
            : console.log(role.role_id + ' nope')
        )
    }

    return (
        <>
            <Table>
                <THead>
                    <FirstTH heading="Name" />
                    <TH heading="Role" />
                    <LastTH heading="Delegated Role" />
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

            <div className="w-3/6 mt-10 bg-white">
                <Accordion>
                    <Accordion.Item value="Reassign Roles">
                        <Accordion.Control>Reassign Roles</Accordion.Control>
                        <Accordion.Panel>

                            {nominations.length > 0 && 
                                <>
                                <p>Ongoing Nominations</p>
                                {nominations.map(nomination =>
                                    <RoleNomination 
                                        nominee={members.find(member => member.id == nomination.user_id).name} 
                                        role={roles.find(role => role.id == nomination.role_id).label}
                                        nominationId={nomination.id}
                                        key={nomination.id}
                                        userInitialApproval={nomination.approvals?.find(approval => approval.user_id == auth.user.id)}
                                    />
                                )}
                                </>
                            }
                                
                                {nominations.length < roles.length &&
                                <p>Select roles to reassign</p>
                                }
                                <form onSubmit={handleSubmit}>

                                    {nominations.find(nomination => nomination.role_id == 2) ? '' :
                                    <Select 
                                        placeholder="Nominate Treasurer" 
                                        isClearable
                                        options={memberDropdownOptions.filter(option => option.role != "Treasurer" && !nominations.find(x => x.user_id == option.value))} 
                                        onChange={(e) => {
                                            e ? 
                                                dispatch({type: 'assignRole', roleId: 2, userId: e.value})
                                            :
                                                dispatch({type: 'removeRole', roleId: 2})
                                        }}
                                    />
                                    }

                                    {nominations.find(nomination => nomination.role_id == 1) ? '' :
                                    <Select
                                        placeholder="Nominate Chair" 
                                        isClearable
                                        options={memberDropdownOptions.filter(option => option.role != "Chair" && !nominations.find(x => x.user_id == option.value))} 
                                        onChange={(e) => {
                                            e ? 
                                                dispatch({type: 'assignRole', roleId: 1, userId: e.value})
                                            :
                                                dispatch({type: 'removeRole', roleId: 1})
                                        }}
                                    />
                                    }

                                    {nominations.find(nomination => nomination.role_id == 3) ? '' :
                                    <Select
                                        placeholder="Nominate Secretary" 
                                        isClearable
                                        options={memberDropdownOptions.filter(option => option.role != "Secretary" && !nominations.find(x => x.user_id == option.value))} 
                                        onChange={(e) => {
                                            e ? 
                                                dispatch({type: 'assignRole', roleId: 3, userId: e.value})
                                            :
                                                dispatch({type: 'removeRole', roleId: 3})
                                        }}
                                    />
                                    }
                                    {nominations.length < roles.length &&
                                    <button type="submit">Nominate</button>
                                    }
                                </form>

                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </div>
        </>

    )
}
