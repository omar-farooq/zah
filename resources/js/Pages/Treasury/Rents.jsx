import { Button, Loader, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import Select from 'react-select'

export default function Rents({auth}) {

    const [loading, setLoading] = useState(true)
    const [modalOpened, modalHandlers] = useDisclosure(false)
    const [selectedTenantToDestroy, setSelectedTenantToDestroy] = useState({id: '', name: '', rentID: ''})
    const [tenants, setTenants] = useState([])
    const [users, setUsers] = useState([])
    const [newTenant, setNewTenant] = useState({
        id: '',
        rent: ''
    })
    const tenantDropdownRef = useRef('')

    const getUsers = async () => {
        setLoading(true)
        let res1 = await axios.get('/users?filter=none')
        let res3 = await axios.get('/users?filter=tenants')
        setUsers(res1.data)
        setTenants(res3.data)
        setLoading(false)
    }


    useEffect(() => {
		getUsers()
    },[])

    const updateRent = async (id, value) => {
        await axios.patch('/rents/'+id, {
            amount: value
        })
    }

    const addTenancy = async (userId, rent) => {
        await axios.patch('/users/'+userId, {
            is_tenant: 1,
        })

        await axios.post('/rents/', {
            userId: userId,
            amount: rent
        })

        getUsers()
        setNewTenant({id: '', rent: ''})
        tenantDropdownRef.current ? tenantDropdownRef.current.clearValue() : ''
    }

    const removeTenancy = async (userId, rentId) => {
        await axios.patch('/users/'+userId, {
            is_tenant: 0,
        })

        await axios.delete('/rents/'+rentId)

        getUsers()
    }

    return (
        loading ? <Loader size="xl" className="mt-48" /> :
        <>
            <div className="text-3xl mb-4">Manage Rents</div>
            <table className="table-fixed border-collapse bg-white text-lg">
                <thead>
                    <tr>
                        <th className="border-b border-black p-2">Tenants</th>
                        <th className="border-b border-black p-2">Rent</th>
                        <th className="border-b border-black p-2">Tenancy End</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map(tenant =>
                        <tr key={tenant.id}>
                            <td className="border-b border-slate-300 px-2">
                                {tenant.name}
                            </td>
                            <td className="border-b border-slate-300">
                                <input 
                                    defaultValue={"£"+tenant.rent?.amount}
                                    className="text-center w-28 sm:w-auto"
                                    onChange={(e) => updateRent(tenant.rent.id, e.target.value)}
                                />
                            </td>
                            <td className="border-b border-slate-300 px-2">
                                <TrashIcon 
                                    className="h-5 w-5 cursor-pointer m-auto" 
                                    onClick={() => {modalHandlers.open(); setSelectedTenantToDestroy({...selectedTenantToDestroy, id: tenant.id, name: tenant.name, rentID: tenant.rent.id})}}
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="mt-6 w-full md:w-1/3">
                <span>Add Tenant</span>
                <Select 
                    options={
                        users.reduce((a,b) => {
                            if(!b.is_tenant) {
                                return [...a, {value: b.id, label: b.name}]
                            }
                            return a
                        },[])
                    }
                    isClearable
                    onChange={
                        (e) => e ? 
                            setNewTenant({id: e.value, rent: '0'}) 
                        : 
                            setNewTenant({id: '', rent: ''})
                    }
                    ref={tenantDropdownRef}
                /> 

                {newTenant.id ?
                    <div className="flex flex-col"> set rent (£/week)
                        <input
                            type="number"
                            defaultValue="0"
                            onChange={(e) => setNewTenant({...newTenant, rent: e.target.value})}
                        />
                        <Button 
                            onClick={() => addTenancy(newTenant.id, newTenant.rent)}
                            className="bg-blue-500 my-3 w-full md:w-1/2 self-center"
                        >
                            Add Tenant
                        </Button>
                    </div>
                :''}
            </div>
            <Modal opened={modalOpened} onClose={modalHandlers.close} title="Confirm Delete" centered>
                <div className="mb-4">Are you sure you want to remove {selectedTenantToDestroy.name}'s tenancy?</div>
                <button
                    onClick={(e) => {removeTenancy(selectedTenantToDestroy.id, selectedTenantToDestroy.rentID); modalHandlers.close()}}
                    className="bg-red-600 hover:bg-red-700 text-white h-9 w-20 border rounded-md mr-0.5"
                >
                    Confirm
                </button>
                <button className="bg-zinc-800 text-white h-9 w-20 border rounded-md" onClick={modalHandlers.close}>Cancel</button>
            </Modal>

        </>
    )
}
