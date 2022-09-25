export default function RequestFormInput({type, name, id, changeAction, accept, step, placeholder, additionalClasses}) {
    return (
        <input 
            className={`border border-gray-300 p-4 rounded w-full text-base leading-4 placeholder-gray-600 text-gray-600 ${additionalClasses}`}
            type={type} 
            name={name} 
            id={id} 
            placeholder={placeholder} 
            onChange={changeAction} 
        />
         
    )
}
