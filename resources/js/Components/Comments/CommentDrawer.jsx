import Comments from './index'
import { Drawer } from '@mantine/core'

export default function CommentDrawer({model, commentRoute, openHook}) {
    const [opened, { open, close }] = openHook

    return (
        <Drawer
            opened={opened}
            onClose={close}
            title="Comments"
            position="right"
        >
            <Comments 
                model={model}
                commentRoute={commentRoute}
            />
        </Drawer>
    )
}
