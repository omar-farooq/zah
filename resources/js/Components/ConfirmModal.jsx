import { Link } from '@inertiajs/react'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'

export default function ConfirmModal({title="Confirm Delete", text='', confirmFunction, cancelFunction, modalOpened}) {

    return (
        <Modal opened={modalOpened} onClose={() => cancelFunction()} title={title} centered>
            <div className="mb-4">{text}</div>
            {modalOpened &&
                <button
                    onClick={(e) => confirmFunction()}
                    className="bg-red-600 hover:bg-red-700 text-white h-9 w-20 border rounded-md mr-0.5"
                >
                    Confirm
                </button>
            }
            <button className="bg-zinc-800 text-white h-9 w-20 border rounded-md" onClick={() => cancelFunction()}>Cancel</button>
        </Modal>
    )
}
