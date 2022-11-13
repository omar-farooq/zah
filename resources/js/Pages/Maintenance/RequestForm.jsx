import { ClockIcon } from '@heroicons/react/24/outline'
import { DatePicker, DateRangePicker, TimeRangeInput } from '@mantine/dates'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import { useForm } from '@inertiajs/inertia-react'
import { useState, useEffect } from 'react'
import Checkbox from '@/Components/RequestFormCheckbox'
import Input from '@/Components/RequestFormInput'
import RequestFormButton from '@/Components/RequestFormButton'

export default function MaintenanceRequestForm() {

    const [price, setPrice] = useState('')
    const [dateRange, setDateRange] = useState('single')
    const [maintenance, setMaintenance] = useState('Repair')

    const { data, setData, post, processing, errors } = useForm({
        required_maintenance: '',
        reason: '',
        cost: '',
        contractor: '',
        contractor_phone: '',
        contractor_email: '',
        type: 'Repair',
        start_date: '',
        end_date: '',
        start_time: '',
        finish_time: '',
        emergency: '0'
    })

    /* Fix the TimeInput as it's broken out of the box */
    useEffect(() => {
        document.querySelectorAll('.mantine-TimeInput-timeInput').forEach(input => {
            input.style.width="50px",
            input.style.height="30px",
            input.style.border="0px"
        })
    },[])

    function submit(e) {
        e.preventDefault()
        post('/maintenance-requests')
    }

    return (
            <RequestLayout>
                <Title position='centre'>Request Maintenance</Title> 
                <TileContainer>
        
                    <FormTile position='centre'> 

                        <div className="mt-8">
                            <FormLabel>Maintenance</FormLabel>
                            <Input 
                                type="text" 
                                name="Requirement" 
                                id="RequirementInput" 
                                placeholder="Required Maintenance" 
                                changeAction={(e) => {setData('required_maintenance', e.target.value)}} 
                            />
                            <ShowErrors>
                                {errors.required_maintenance}
                            </ShowErrors>

                            <Input 
                                type="text" 
                                name="Reason" 
                                id="ReasonInput" 
                                placeholder="Reason" 
                                changeAction={(e) => {setData('reason', e.target.value)}} 
                            />
                            <ShowErrors>
                                {errors.reason}
                            </ShowErrors>
                        </div>
       
                        <FormLabel>Cost</FormLabel>
                        <InputContainer>
                            <div>
                                <HiddenCurrencyInput amount={price} />

                                <Input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="Cost" 
                                    changeAction={(e) => {e.target.value == '' ? setPrice('') : setPrice(parseFloat(e.target.value).toFixed(2)); setData('cost', e.target.value)}} 
                                />
                                <ShowErrors>{errors.cost}</ShowErrors>
                            </div>

                        </InputContainer>

                        <FormLabel>Date/Time</FormLabel>
                        <InputContainer>
                            <label htmlFor="single">Single Day</label>
                            <input 
                                type="radio" 
                                id="single" 
                                value="single" 
                                name="dateRange" 
                                checked={dateRange == 'single'} 
                                onChange={(e) => {setDateRange('single'); setData({...data, start_date: '', end_date: ''})}} 
                                className="ml-0.5" 
                            />
                            <label htmlFor="multiple" className="ml-5">Multiple Days</label>
                            <input 
                                type="radio" 
                                id="multiple" 
                                value="multiple" 
                                name="dateRange" 
                                checked={dateRange == 'multiple'} 
                                onChange={(e) => {setDateRange('multiple'); setData({...data, start_date: '', end_date: ''})}} 
                                className="ml-0.5" 
                            />

                            <div className="m-auto">
                            {
                                dateRange == 'single' ?
                                    <DatePicker 
                                        placeholder="Date of Maintenance" 
                                        label="Maintenance Date" 
                                        withAsterisk
                                        onChange={(e) => setData({...data, start_date: e, end_date: e})}
                                        minDate={new Date}
                                    />

                                : dateRange == 'multiple' ?
                                    <DateRangePicker 
                                        placeholder="Dates of Maintenance" 
                                        label="Maintenance Dates" 
                                        withAsterisk 
                                        onChange={(e) => setData({...data, start_date: e[0], end_date: e[1]})}
                                        minDate={new Date}
                                    />

                                : ''
                            }
                                <TimeRangeInput 
                                    label="Maintenance Time" 
                                    onChange={(e) => setData({...data, start_time: e[0], finish_time: e[1]})} 
                                    clearable 
                                    withAsterisk
                                    icon={<ClockIcon className="h-5 w-5" />}
                                />
                                <ShowErrors>{errors.start_time}</ShowErrors>
                                <ShowErrors>{errors.finish_time}</ShowErrors>
                            </div>
                        </InputContainer>

                        <FormLabel>Contractor details</FormLabel>
                        <InputContainer>
                            <div>

                                <Input 
                                    type="text"
                                    placeholder="Contractor" 
                                    changeAction={(e) => {setData('contractor', e.target.value)}} 
                                />

                                <ShowErrors>
                                    {errors.contractor}
                                </ShowErrors>
                            </div>
                            <div className="flex-row flex">
                                <Input
                                    type="text"
                                    placeholder="phone"
                                    changeAction={(e) => {setData('contractor_phone', e.target.value)}}
                                />

                                <Input
                                    type="text"
                                    placeholder="email"
                                    changeAction={(e) => {setData('contractor_email', e.target.value)}}
                                />
                                <ShowErrors>{errors.contractor_email}</ShowErrors>

                            </div>
                        </InputContainer>

                        <FormLabel>Type</FormLabel>
                        <InputContainer>
                            <div>
                                <select 
                                    onChange={(e) => {
                                        setData('type', e.target.value);
                                        setMaintenance(e.target.value)}
                                    }>
                                    <option value="Repair">Repair</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Gas check">Gas Check</option>
                                    <option value="Fire Alarm check">Fire Alarm Check</option>
                                    <option value="Garden Maintenance">Garden Maintenance</option>
                                    <option value="Drive">Drive/Garage</option>
                                    <option value="Other">Other</option>
                                </select>

                                {maintenance == 'Other' &&
                                <Input
                                    type="text"
                                    placeholder="type of maintenance" 
                                    changeAction={(e) => {setData('type', e.target.value)}} 
                                />}
                            </div>
                        </InputContainer>
        
                        <FormLabel>Check if Emergency</FormLabel>
                        <InputContainer>
                            <Checkbox
                                changeAction={(e) => setData('emergency', e.target.checked)} 
                            />
                        </InputContainer>

                        <RequestFormButton text="Make Request" submitAction={submit} /> 
                    </FormTile>
                </TileContainer>
            </RequestLayout>

    )
}
