import { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/24/solid'
import { InertiaLink } from '@inertiajs/inertia-react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { createStyles, Button, Group, Paper, SimpleGrid, Text , ThemeIcon } from '@mantine/core'
import Select from 'react-select'
import SmallTable, { FirstTD, FirstTH, LastTD, LastTH, TBody, TD, THead, TH } from '@/Components/SmallTable'
import Input from '@/Components/Input'

export default function TreasurySummary({currentYearPurchaseCount, previousYearPurchaseCount, currentBalance, previousYearBalance, currentSpending, previousYearSpending}) {

    const [newPayment, setNewPayment] = useState({
        recipient: '',
        description: '',
        amount: '',
        frequency: '',
        day_of_week_due: '',
        day_of_month_due: '',
        month_due: ''
    })

    const [recurringPayments, setRecurringPayments] = useState([])

    //Used for the recurring payments frequency dropdown
    const [frequency, setFrequency] = useState('')

    const annualDayRef = useRef(null)
    const frequencyRef = useRef(null)
    const dayOfWeekRef = useRef(null)
    const dayOfMonthRef = useRef(null)

    //Handle the Add Payment button being clicked
    const handleAddPayment = async (e) => {
        e.preventDefault()
        let res = await axios.post('/recurring-payments', newPayment)
        setNewPayment({recipient: '', description: '', amount: '', frequency: '', day_of_week_due: '', day_of_month_due: '', month_due: ''})
        frequencyRef.current.clearValue()
        setFrequency('')
        getRecurringPayments()
    }

    const getRecurringPayments = async () => {
        let res = await axios.get('/recurring-payments')
        setRecurringPayments(res.data)
    }

    useEffect(() => {
        getRecurringPayments()
    },[])

    function dayOfWeekAsString(dayIndex) {
        return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIndex] || ''
    }

    function monthAsString(monthIndex) {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "Sepetember", "October", "November", "December"][monthIndex] || ''
    }

    function upcomingMonthlyPayment(dayOfMonth) {
        let month = new Date().getMonth()
        let today = new Date().getDate()
        if(today > dayOfMonth) {
            return monthAsString(month + 1) + " " + dayOfMonth
        } else {
            return monthAsString(month) + " " + dayOfMonth
        }
    }

    const handleFrequencyChange = (e) => {
        setNewPayment({...newPayment, frequency: e.value, day_of_week_due: '', day_of_month_due: '', month_due: ''});
        setFrequency(e.value)
        dayOfWeekRef.current?.clearValue()
        dayOfMonthRef.current?.clearValue()
    }

    const handlePaymentDelete = (paymentID) => {
        setRecurringPayments(recurringPayments.filter(x => x.id != paymentID))
    }

    const useStyles = createStyles((theme) => ({
          root: {
                  padding: `calc(${theme.spacing.xl} * 1.5)`,
                  marginTop: '40px'
                },

          label: {
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                },
    }));

    function calculateSpendingDiff(prev, curr) {
        return (((curr - prev) * 100) / prev).toFixed(2)
    }

    function calculateBalanceDiff(prev, curr) {
        let diff
        if(prev < 0 && curr < 0) {
            diff = curr - prev
            return -(diff * 100 / prev).toFixed(2)
        } else if(prev > 0 && curr < 0) {
            diff = curr - prev
            return (diff * 100 / prev).toFixed(2)
        } else if(prev < 0 && curr > 0) {
            diff = curr - prev
            return -(diff * 100 / prev).toFixed(2)
        } else {
            diff = curr - prev
            return (diff * 100 / prev).toFixed(2)
        }
    }

    const data = [
        {title: 'Average Spending', value: '£' + (currentSpending / 12).toFixed(2) + 'per month', diff: calculateSpendingDiff(previousYearSpending, currentSpending)},
        {title: 'Balance', value: "£" + currentBalance, diff: calculateBalanceDiff(previousYearBalance, currentBalance)},
        {title: 'Number of Purchases this year', value: currentYearPurchaseCount, diff: (currentYearPurchaseCount - previousYearPurchaseCount * 100 / previousYearPurchaseCount).toFixed(2)}
    ]

      const { classes } = useStyles();
      const stats = data.map((stat) => {
          const DiffIcon = stat.diff > 0 ? ArrowUpRightIcon : stat.diff < 0 ? ArrowDownRightIcon : stat.diff == 'NaN' ? ArrowUpRightIcon : ArrowRightIcon

              return (
                        <Paper withBorder p="md" radius="md" key={stat.title}>
                          <Group position="apart">
                            <div>
                              <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
                                {stat.title}
                              </Text>
                              <Text fw={700} fz="xl">
                                {stat.value}
                              </Text>
                            </div>
                            <ThemeIcon
                              color="gray"
                              variant="light"
                              sx={(theme) => ({ color: stat.diff > 0 || stat.diff == 'NaN' ? theme.colors.teal[6] : stat.diff < 0 ? theme.colors.red[6] : theme.colors.gray[6] })}
                              size={38}
                              radius="md"
                            >
                              <DiffIcon className="h-6 w-6" stroke={1.5} />
                            </ThemeIcon>
                          </Group>
                          <Text c="dimmed" fz="sm" mt="md">
                            <Text component="span" c={stat.diff > 0 ? 'teal' : 'red'} fw={700}>
                              {stat.diff != 'NaN' &&
                              stat.diff + '%'}
                            </Text>{' '}
                            {stat.diff > 0 ? 'increase' : stat.diff < 0 ? 'decrease' : stat.diff == 'NaN' ? 'no history' : 'no change'} from last year
                          </Text>
                        </Paper>
                      );
            });

    return (
        <>           
            <div className={classes.root}>
                <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                   {stats}
                </SimpleGrid>
            </div>

            <div className="mt-4 w-full flex flex-col items-center">
                <div className="text-2xl">Recurring Payments</div>
                <SmallTable>
                    <THead>
                        <FirstTH heading="Recipient" />
                        <TH heading="description" />
                        <TH heading="Frequency" />
                        <TH heading="Amount" />
                        <TH heading="Next Due" />
                        <LastTH />
                        
                    </THead>
                    <TBody>
                        {recurringPayments?.map(payment => (
                            <Fragment key={payment.id}>
                                <tr>
                                    <FirstTD data={payment.recipient} />
                                    <TD>{payment.description}</TD>
                                    <TD>{payment.frequency}</TD>
                                    <TD>{payment.amount}</TD>
                                    <TD>
                                        {
                                            payment.frequency == "weekly" ? 
                                                dayOfWeekAsString(payment.day_of_week_due)

                                            : payment.frequency == "monthly" ?
                                                upcomingMonthlyPayment(payment.day_of_month_due)
                                            :
                                                monthAsString(payment.month_due) + " " + payment.day_of_month_due
                                        }
                                    </TD>
                                    <LastTD> 
                                        <InertiaLink href={route('recurring-payments.destroy', payment.id)} method="delete" as="button" onClick={(e) => handlePaymentDelete(payment.id)}>
                                            <TrashIcon className="w-5 h-5" />
                                        </InertiaLink>
                                    </LastTD>
                                </tr>
                            </Fragment>
                        ))}
                    </TBody>
                </SmallTable>
            </div>

            <form 
                className="grid grid-cols-2 gap-2 mt-8 mb-8"
                onSubmit={(e) => handleAddPayment(e)}
            >
                <div className="col-start-1 col-end-3 text-center mb-2">Add a new payment</div>
                <Input
                    placeholder={"Recipient"}
                    className="h-10"
                    value={newPayment.recipient}
                    required={true}
                    handleChange={(e) => setNewPayment({...newPayment, recipient: e.target.value})}
                />

                <Input
                    placeholder={"Short explanation"}
                    className="h-10"
                    value={newPayment.description}
                    handleChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                />
                    
                <Input
                    type={"number"}
                    placeholder={"Amount"}
                    required={true}
                    className="h-10"
                    value={newPayment.amount}
                    handleChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                />
                <Select
                    name="frequency"
                    options={[
                        {value: 'weekly', label: 'Weekly'},
                        {value: 'monthly', label: 'Monthly'},
                        {value: 'annually', label: 'Annually'}
                    ]}
                    placeholder="Frequency"
                    ref={frequencyRef}
                    required={true}
                    onChange={(e) => {
                        e ? handleFrequencyChange(e) : ''
                    }}
                />

                {
                    frequency == 'weekly' ?
                        <Select
                            name="dayOfWeek"
                            options={[
                                {value: '1', label: 'Monday'},
                                {value: '2', label: 'Tuesday'},
                                {value: '3', label: 'Wednesday'},
                                {value: '4', label: 'Thursday'},
                                {value: '5', label: 'Friday'},
                                {value: '6', label: 'Saturday'},
                                {value: '0', label: 'Sunday'},
                            ]}
                            placeholder="Payment Day"
                            required={true}
                            ref={dayOfWeekRef}
                            onChange={(e) => e ? setNewPayment({...newPayment, day_of_week_due: e.value}) : ''}
                        />

                    : frequency == 'monthly' ?
                        <Select
                            name="dayOfMonth"
                            options={
                                Array(28).fill().map((_, i) => ({
                                    value: i+1, label: i+1
                                }))
                            }
                            placeholder="Payment Day"
                            required={true}
                            ref={dayOfMonthRef}
                            onChange={(e) => e ? setNewPayment({...newPayment, day_of_month_due: e.value}) : ''}
                        />

                    : frequency == 'annually' ?
                        <>
                        <Select
                            name="month"
                            options={[
                                {value: '0', label: 'January'},
                                {value: '1', label: 'February'},
                                {value: '2', label: 'March'},
                                {value: '3', label: 'April'},
                                {value: '4', label: 'May'},
                                {value: '5', label: 'June'},
                                {value: '6', label: 'July'},
                                {value: '7', label: 'August'},
                                {value: '8', label: 'September'},
                                {value: '9', label: 'October'},
                                {value: '10', label: 'November'},
                                {value: '11', label: 'December'}
                            ]}
                            placeholder="Payment Month"
                            required={true}
                            onChange={(e) => {
                                setNewPayment({...newPayment, month_due: e.value, day_of_month_due: ''});
                                annualDayRef.current?.clearValue()
                            }}
                        />
                       
                        {newPayment.month_due &&
                            <Select
                                name="dayOfMonthAnnually"
                                options={
                                    Array(newPayment.month_due == 1 ? 28 : (newPayment.month_due == 3 || newPayment.month_due == 5 || newPayment.month_due == 8 || newPayment.month_due == 10) ? 30 : 31).fill().map((_, i) => ({
                                        value: i+1, label: i+1
                                    }))
                                }
                                placeholder="Day of Month"
                                ref={annualDayRef}
                                required={true}
                                onChange={(e) => e ? setNewPayment({...newPayment, day_of_month_due: e.value}) : ''}
                            />}
                        </>

                    :
                        ''
                }
                                
                <Button 
                    className="bg-sky-600 hover:bg-sky-600 col-start-1 col-end-3"
                    type="Submit"
                >
                    Add Payment
                </Button>
            </form>
        </>
    );
}
