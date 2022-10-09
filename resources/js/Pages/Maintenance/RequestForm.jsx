import { useState } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { Calendar } from 'primereact/calendar'
import { HiddenCurrencyInput, ShowErrors, InputContainer, FormLabel, RequestLayout, Title, TileContainer, PreviewTile, FormTile } from '@/Layouts/RequestLayout'
import RequestFormButton from '@/Components/RequestFormButton'
import Input from '@/Components/RequestFormInput'
import Checkbox from '@/Components/RequestFormCheckbox'

export default function MaintenanceRequestForm() {

    const [price, setPrice] = useState('')
    const { data, setData, post, processing, errors } = useForm({
        required_maintenance: '',
        reason: '',
        cost: '',
        contractor: '',
        contractor_phone: '',
        contractor_email: '',
        type: '',
        start: '',
        finish: '',
        emergency: '0'
    })

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

                        <FormLabel> Date/time</FormLabel>
                        <InputContainer>
                            <div className="m-auto">
                                <Calendar id="time24h" onChange={(e) => setData('start', e.value)} showTime placeholder="Start Time" />
                                <Calendar id="time24h" onChange={(e) => setData('finish', e.value)} showTime placeholder="Finish Time" />
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

                            </div>
                        </InputContainer>

                        <FormLabel>Type</FormLabel>
                        <InputContainer>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="type of maintenance" 
                                    changeAction={(e) => {setData('type', e.target.value)}} 
                                />
                                <select onChange={(e) => setData('type', e.target.value)}>
                                    <option value="Gas check">Gas Check</option>
                                    <option value="Fire Alarm check">Fire Alarm Check</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Garden Maintenance">Garden Maintenance</option>
                                    <option value="Drive">Drive/Garage</option>
                                    <option value="Other">Other</option>
                                </select>
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
