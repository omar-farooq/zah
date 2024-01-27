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

    //State for Accounts
    const [newAccount, setNewAccount] = useState({account_name: '', bank: '', description: '', starting_balance: ''})
    const [accounts, dispatch] = useReducer(reducer, initialAccounts)
	const [selectedAccountToDestroy, setSelectedAccountToDestroy] = useState({id: '', account_name: ''})
	const [modalOpened, modalHandlers] = useDisclosure(false)

    //State for Default Accounts
    const [defaultAccountsList, setDefaultAccountsList] = useState(defaultAccounts)
    const [defaultPaymentType, setDefaultPaymentType] = useState('')
    const [defaultAccount, setDefaultAccount] = useState('')

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

    const SubmitDefaultAccount = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post('/accounts?default', {account_id: defaultAccount, model: defaultPaymentType})
            await SuccessNotification('Made Default', 'Successfully added a default account for '+defaultPaymentType)
            setDefaultPaymentType('')
            setDefaultAccount('')
            setDefaultAccountList(res.data)
        } catch (error) {
            ErrorNotification('Error', error)
        }
    }

    const ModelToName = (model) => {
        switch (model) {
            case "App\\Models\\Purchase":
                return "Purchases"
                break;
            case "App\\Models\\Maintenance":
                return "Maintenance and Services"
                break;
            case "App\\Models\\PaidRent":
                return "Rent"
                break;
            case "App\\Models\\RecurringPayment":
                return "Recurring Payments"
                break;
            case "App\\Models\\Payment":
                return "General Payements"
                break;
            default:
                return "Payment model not correctly defined"
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
                                <TD data={x.treasury_reports ? "£" + (x.treasury_reports[0]?.pivot.account_balance) : "£" + x.starting_balance} />
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

            {/*Table of Default accounts*/}
            {
                defaultAccountsList.length > 0 ?
                    <>
                    <div className="text-xl mt-10">Default account set</div>
                    <Table>
                        <THead>
                            <FirstTH heading="Payment Type" />
                            <TH heading="Account" />
                        </THead>
                        <TBody>
                            {defaultAccountsList.map(x =>
                                <Fragment key={x.id}>
                                    <tr>
                                        <FirstTD data={ModelToName(x.model)} />
                                        <TD data={accounts.find(y => y.id === x.account_id).account_name} />
                                    </tr>
                                </Fragment>
                            )}
                        </TBody>
                    </Table>
                    </>
                    :
                    <div className="mt-10">The default account hasn&apos;t been set for anything as of yet</div>

            }

            {/* Set the default account for each payable model */}
            <div className="text-xl mt-10">Set the default account for each payment type</div>
            <div className="w-full flex flex-row items-center justify-center gap-x-4 mb-4">
                <Select 
                    options={[
                        {value: 'App\\Models\\Purchase', label: 'Purchases'},
                        {value: 'App\\Models\\Maintenance', label: 'Maintenance'},
                        {value: 'App\\Models\\PaidRent', label: 'Rent'},
                        {value: 'App\\Models\\RecurringPayment', label: 'Recurring Payments'},
                        {value: 'App\\Models\\Payment', label: 'General Payments'},
                    ]}
                    placeholder={"Payment type"}
                    className="w-1/4"
                    onChange={(e) => setDefaultPaymentType(e.value)}
                />
                <Select 
                    options={accounts.map(x => ({
                        value: x.id,
                        label: x.account_name
                    }))}
                    placeholder={"Select Account"}
                    className="w-1/4"
                    onChange={(e) => setDefaultAccount(e.value)}
                />
            </div>
            <ButtonColoured
                bgcolour="bg-red-600"
                buttonText="Make Default"
                onclick={(e) => SubmitDefaultAccount(e)}
            />
        </>
    )
}
