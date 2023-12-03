import { Fragment, useState, useReducer } from 'react'
import { ErrorNotification, SuccessNotification } from '@/Components/Notifications'
import { InertiaLink } from '@inertiajs/inertia-react'
import { Modal } from '@mantine/core'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useDisclosure } from '@mantine/hooks'
import ButtonColoured from '@/Components/ButtonColoured'
import Input from '@/Components/Input'
import Label from '@/Components/Label'
import Select from 'react-select'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'

function reducer(accounts, action) {
    switch(action.type) {
        case 'add': {
            return [...accounts, action.newAccount]
        }
		case 'delete': {
			return accounts.filter(x => x.id !== action.id)
		}
    }
        throw Error('Unknown action: ' + action.type);
}

export default function AccountsIndex({initialAccounts, defaultAccounts}) {

    const [newAccount, setNewAccount] = useState({account_name: '', bank: '', description: '', starting_balance: ''})
    const [accounts, dispatch] = useReducer(reducer, initialAccounts)
	const [selectedAccountToDestroy, setSelectedAccountToDestroy] = useState({id: '', account_name: ''})
	const [modalOpened, modalHandlers] = useDisclosure(false)

    const SubmitNewAccount = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post('/accounts', newAccount) 
            dispatch({type: 'add', newAccount: res.data})
            SuccessNotification('Created', 'Successfully added a new account')
            setNewAccount({account_name: '', bank: '', description: '', starting_balance: ''})
        } catch (error) {
            ErrorNotification('Error', error)
        }
    }

    return (
        <>
            {/*Table of accounts*/}
            <div className="text-2xl">
                Accounts
            </div>
            <Table>
                <THead>
                    <FirstTH heading="Name" />
                    <TH heading="Bank" />
                    <TH heading="Balance" />
                    <TH heading="Description" />
                </THead>
                <TBody>
                    {accounts.map(x => 
                        <Fragment key={x.id}>
                            <tr>
                                <FirstTD data={x.account_name} />
                                <TD data={x.bank} />
                                <TD data={"£" + (x.treasury_reports[0]?.pivot.account_balance ?? x.starting_balance)} />
                                <TD data={x.description} />
                                <LastTD>
                                    <TrashIcon
                                        className="w-5 h-5 cursor-pointer"
										onClick={() => {modalHandlers.open(); setSelectedAccountToDestroy({...selectedAccountToDestroy, id: x.id, name: x.account_name})}}
                                    />
                                </LastTD>
                            </tr>
                        </Fragment>
                    )}
                </TBody>
            </Table>
            
            {/*Table of Default accounts*/}
            {
                defaultAccounts.length > 0 ?
                    <div className="text-xl mt-10">Default account set</div>
                    :
                    <div>The default account hasn't been set for anything as of yet</div>

            }

            {/* Set the default account for each payable model */}
            <div className="text-xl mt-10">Set a default account</div>
            <Select 
                
            />
       
            {/* Form to add a new account to the accounts table */}
            <div className="text-xl mt-10">Add an account</div>
            <form className="w-full grid grid-cols-6 gap-y-3 gap-x-5">
                <div className="col-start-2 col-end-4">
                    <Label>Account name</Label>
                    <Input 
                        className="w-full"
                        value={newAccount.account_name}
                        handleChange={(e) => setNewAccount({...newAccount, account_name: e.target.value})}
                    />
                </div>
                <div className="col-start-4 col-end-6">
                    <Label>Bank</Label>
                    <Input 
                        className="w-full"
                        value={newAccount.bank}
                        handleChange={(e) => setNewAccount({...newAccount, bank:e.target.value})}
                    />
                </div>
                <div className="col-start-2 col-end-4">
                    <Label>Description</Label>
                    <Input 
                        className="w-full"
                        value={newAccount.description}
                        handleChange={(e) => setNewAccount({...newAccount, description:e.target.value})}
                    />
                </div>
                <div className="col-start-4 col-end-6">
                    <Label>Initial amount (£)</Label>
                    <Input
                        type="number"
                        className="w-full"
                        value={newAccount.starting_amount}
                        handleChange={(e) => setNewAccount({...newAccount, starting_balance: e.target.value})}
                    />
                </div>
                <div className="col-start-3 col-end-5 flex items-center justify-center">
                    <ButtonColoured
                        bgcolour="bg-blue-500"
                        buttonText="Submit"
                        onclick={(e) => SubmitNewAccount(e)}
                    />
                </div>
            </form>
            <Modal opened={modalOpened} onClose={modalHandlers.close} title="Confirm Delete" centered>
                <div className="mb-4">Are you sure you want to delete the Account {selectedAccountToDestroy.name}?</div>
                <InertiaLink
                    href={route('accounts.destroy', selectedAccountToDestroy.id)}
                    method="delete" as="button"
                    onClick={() => {dispatch({type: 'delete', id: selectedAccountToDestroy.id}); modalHandlers.close()}}
                    className="bg-red-600 hover:bg-red-700 text-white h-9 w-20 border rounded-md mr-0.5"
                >
                    Confirm
                </InertiaLink>
                <button className="bg-zinc-800 text-white h-9 w-20 border rounded-md" onClick={modalHandlers.close}>Cancel</button>
            </Modal>
        </>
    )
}
