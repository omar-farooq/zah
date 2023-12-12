import { useState } from 'react'

export default function CalculateAccountBalance({account,rentTotal,purchasesTotal,servicesTotal,recurringTotal,payableTotal}) {

    const calculateBalance = () => {
        return (Number(payableTotal) + Number(rentTotal) + Number(account.treasury_reports[0]?.pivot.account_balance ?? account.starting_balance) - Number(recurringTotal) - Number(purchasesTotal) - Number(servicesTotal)).toFixed(2)
    }

    return (
        <div>{account.account_name}</div>
    )
}
