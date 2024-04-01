import { useEffect, useState } from 'react'
import { FirstTD, TD } from '@/Components/SmallTable'

export default function CalculateAccountBalance({account,rentTotal,purchasesTotal,servicesTotal,recurringTotal,additionalPaymentsTotal,balanceHook}) {

    const [balance, setBalance] = balanceHook
    const [calculatedBalanceCheckbox, setCalculatedBalanceCheckbox] = useState(true)

    useEffect(() => {
        const balanceCalculator = () => {
            setBalance([...balance.filter(x => x.id != account.id), {...balance.find(x => x.id === account.id), calculated: (Number(additionalPaymentsTotal) + Number(rentTotal) + Number(account.treasury_reports[0]?.pivot.account_balance ?? account.starting_balance) - Number(recurringTotal) - Number(purchasesTotal) - Number(servicesTotal)).toFixed(2)}])
        }
        balanceCalculator()
    },[rentTotal,purchasesTotal,servicesTotal,recurringTotal,additionalPaymentsTotal])

	const toggleCheckbox = () => {
		if(!calculatedBalanceCheckbox) {
			setBalance([...balance.filter(x => x.id != account.id), {...balance.find(x => x.id === account.id), final: null}])
		}
		setCalculatedBalanceCheckbox(!calculatedBalanceCheckbox)
	}

	const setManualBalance = (e) => {
		setBalance([...balance.filter(x => x.id != account.id), {...balance.find(x => x.id === account.id), final: e.target.value}])
	}

	return (
		<tr>
			<FirstTD data={account.account_name} />
			<TD data={'£'+Number(account.treasury_reports[0]?.pivot.account_balance ?? account.starting_balance).toFixed(2)} />
			<TD data={'£'+balance.find(x => x.id === account.id).calculated} />
			<TD>
				{
					<input
						type="checkbox"
						checked={calculatedBalanceCheckbox}
						onChange={() => toggleCheckbox()}
					/>
				}
			</TD>
			<TD>
				{
					calculatedBalanceCheckbox ? 
						'£'+balance.find(x => x.id === account.id).calculated 
					: 
						<input
							type="number"
							step="0.01"
							id="set-balance"
							onChange={(e) => setManualBalance(e)}
						/>
				}
			</TD>
		</tr>
	)
}
