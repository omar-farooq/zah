import { useEffect, useState } from 'react'

export default function CalculateAccountBalance({account,rentTotal,purchasesTotal,servicesTotal,recurringTotal,payableTotal,balanceHook}) {

    const [balance, setBalance] = balanceHook

    useEffect(() => {
        const balanceCalculator = () => {
            setBalance([...balance.filter(x => x.id != account.id), {...balance.find(x => x.id === account.id), amount: (Number(payableTotal) + Number(rentTotal) + Number(account.treasury_reports[0]?.pivot.account_balance ?? account.starting_balance) - Number(recurringTotal) - Number(purchasesTotal) - Number(servicesTotal)).toFixed(2)}])
        }
        balanceCalculator()
    },[rentTotal,purchasesTotal,servicesTotal,recurringTotal,payableTotal])

    return (
        <div className="flex flex-col mb-4">
            <div>{account.account_name} account</div>
            <div>Starting balance: £{Number(account.treasury_reports[0]?.pivot.account_balance ?? account.starting_balance).toFixed(2)}</div>
            <div>Calculated balance: £{balance.find(x => x.id === account.id).amount}</div>
        </div>
    )
}
