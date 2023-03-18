import { DateToUKLocale } from '@/Shared/Functions'
import { Fragment, useState } from 'react'
import { Pagination } from '@mantine/core'
import Table, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/Table'

export default function TreasuryPlanIndex({treasuryPlansPageOne}) {

	const [treasuryPlans, setTreasuryPlans] = useState(treasuryPlansPageOne)

	const getTreasuryPlans = async (page) => {
		let res = await axios.get('/treasury-plans?getPage=true&page='+page)
		setTreasuryPlans(res.data)
	}

    return (
        <>
	        <div className="w-full flex flex-col items-center">
                <Table>
                    <THead>
                        <FirstTH heading="Creation Date" />
                        <TH heading="Balance at the time (£)" />
                        <TH heading="Balance without plan (£)" />
                        <TH heading="Balance with plan (£)" />
                        <LastTH />
                    </THead>
                    <TBody>
                        {treasuryPlans.data.map(x =>
                            <Fragment key={x.id}>
                                <tr>
                                    <FirstTD data={DateToUKLocale(x.created_at)} />
                                    <TD data={x.available_balance} />
                                    <TD data={x.expected_balance} />
                                    <TD data={x.estimated_remaining_balance} />
                                    <LastTD
                                        href={"treasury-plans"}
                                        itemID={x.id}
                                    >
                                    </LastTD>
                                </tr>
                            </Fragment>
                        )}
                    </TBody>
                </Table>
                <Pagination 
                    className="mt-5 mb-10" 
                    total={treasuryPlans.last_page} 
                    page={treasuryPlans.current_page}
                    onChange={(e) => getTreasuryPlans(e)}
                    withEdges 
                />
			</div>
		</>
    )
}
