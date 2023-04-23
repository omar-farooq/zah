import { InertiaLink } from '@inertiajs/inertia-react'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'

export default function ConfirmModal({title="Confirm Delete", text='', actionRoute, itemID, clickFunction, modalDisclosure}) {

    const [modalOpened, modalHandlers] = modalDisclosure

    return (
        <Modal opened={modalOpened} onClose={modalHandlers.close} title={title} centered>
            <div className="mb-4">{text}</div>
            {modalOpened &&
                <button
                    onClick={(e) => {modalHandlers.close(); clickFunction(itemID)}}
                    className="bg-red-600 hover:bg-red-700 text-white h-9 w-20 border rounded-md mr-0.5"
                >
                    Confirm
                </button>
            }
            <button className="bg-zinc-800 text-white h-9 w-20 border rounded-md" onClick={modalHandlers.close}>Cancel</button>
        </Modal>
    )
}
