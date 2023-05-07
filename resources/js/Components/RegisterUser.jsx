import { useEffect, useState } from 'react'
import Input from '@/Components/Input'

export default function RegisterUser(props) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [users, setUsers] = props.usersHook ?? null

    const submitUser = async(e) => {
        e.preventDefault()
        let newUser = await axios.post('/users', {
            name: name,
            email: email
        })
        setEmail('')
        setName('')
        setUsers([...users, newUser.data])
    }

    return (
        <>
            <div className="mt-10">
                <h2 className="text-2xl">Register a new user</h2>
                <form className="flex flex-col justify-center space-y-1" onSubmit={(e) => submitUser(e)}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <Input 
                            type="text" 
                            name="name"
                            value={name}
                            isFocused={true}
                            handleChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
    
                    <div>
                        <label htmlFor="email">Email</label>
                        <Input 
                            type="text" 
                            name="email"
                            value={email}
                            isFocused={true}
                            handleChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register User</button>
                </form>
            </div>
        </>
    )
}
