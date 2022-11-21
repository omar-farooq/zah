import { Button as LibraryButton } from '@mantine/core'
export default function Button({children}) {
    return (
        <LibraryButton 
            color="dark" 
            type="submit" 
            className="bg-black w-1/4 mt-4"
        >
            {children}
        </LibraryButton>
    )
}
