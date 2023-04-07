import { Button, Loader } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { TrashIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import Select from 'react-select'

export default function Manage({auth}) {

    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [members, setMembers] = useState([])
    const [membershipApproval, setMembershipApproval] = useState([])

    const getUsers = async () => {
        setLoading(true)
        let res1 = await axios.get('/users?filter=none')
        let res2 = await axios.get('/users?filter=members')
        setUsers(res1.data)
        setMembers(res2.data)
        setLoading(false)
    }

    const getMembershipApproval = async () => {
        let res = await axios.get('/approval?model=App\\Models\\Membership')
        setMembershipApproval(res.data)
    }

    useEffect(() => {
        getUsers()
        getMembershipApproval()
    },[])

    const membershipVote = async (id, approval) => {
        await axios.post('/approval', {
            approvable_type: 'App\\Models\\Membership',
            approvable_id: id,
            approval: approval
        })
        getMembershipApproval()
        getUsers()
    }

    const unvote = async (id) => {
        await axios.delete('/approval/'+id)
        getMembershipApproval()
    }

    return (
        loading ? <Loader size="xl" className="mt-48" /> :
        <>
            <div className="text-3xl mt-4">Manage Members</div>
            <div>Note: only votes in the last 48 hours count</div>
            <table className="table-fixed border-collapse border border-slate-400 mt-10">
                <thead>
                    <tr>
                        <th className="border border-slate-300">Members</th>
                        <th className="border border-slate-300">Vote to remove Membership</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member =>
                        <tr key={member.id}>
                            <td className="border border-slate-300 text-center">
                                {member.name}
                            </td>
                            <td className="border border-slate-300 text-center">
                                {membershipApproval.delete.find(approval => approval.approvable_id == member.id) ?
                                    'voted to remove' :
                                    <UserMinusIcon 
                                        className="h-5 w-5 cursor-pointer text-red-700 m-auto" 
                                        onClick={(e) => membershipVote(member.id, 'delete')}
                                    />
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="mt-6 w-5/6 md:w-1/2 lg:w-1/3">
                {membershipApproval.add?.length > 0 && users.length > 0 ?
                        <>
                            <div>voted to make {users.find(x => x.id == membershipApproval.add[0].approvable_id).name} a member</div>
                            <Button 
                                onClick={(e) => unvote(membershipApproval.add[0].id)}
                                className="bg-red-600 hover:!bg-red-700"
                            >
                                Change vote
                            </Button>
                        </>
                    : users.length > 0 && !membershipApproval.add.length > 0 ?
                        <>
                            <span>Add Member</span>
                            <Select 
                                options={
                                    users.reduce((a,b) => {
                                        if(!members.find(x => x.id == b.id)) {
                                            return [...a, {value: b.id, label: b.name}]
                                        }
                                        return a
                                    },[])
                                }
                                onChange={
                                    (e) => membershipVote(e.value, 'add') 
                                }
                            />
                        </>
                    : ''
                }

            </div>
        </>
    )
}
