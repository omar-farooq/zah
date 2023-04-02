import { Accordion } from '@mantine/core'
import Link from '@/Components/Nav/MobileNavLink'
export default function MobileNavMenu({navHook}) {

    const [showingNavigationDropdown, setShowingNavigationDropdown] = navHook
    const linkClick = () => {
        setShowingNavigationDropdown(!showingNavigationDropdown)
    }

    return (
        <Accordion>

            <Accordion.Item value="Meetings">
                <Accordion.Control>Meetings</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='schedule' name='Schedule' />
                    <Link endpoint='meetings.create' name='Join' />
                    <Link endpoint='meetings.index' name='Previous Minutes' />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Treasury">
                <Accordion.Control>Treasury</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='treasury.summary' name='Summary' />
                    <Link endpoint='treasury-reports.index' name='Reports' />
                    <Link endpoint='treasury-plans.latest' name='Plans' />
                    <Link endpoint='rents.index' name='Rents' />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Purchases">
                <Accordion.Control>Purchases</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='purchases.index' name='All Purchases' />
                    <Link endpoint='purchase-requests.create' name='Request' />
                    <Link endpoint='purchase-requests.index' name='Pending Approval' />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Maintenance">
                <Accordion.Control>Maintenance</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='maintenance.index' name='All Maintenance' />
                    <Link endpoint='maintenance.upcoming' name='Upcoming' />
                    <Link endpoint='maintenance-requests.create' name='Request' />
                    <Link endpoint='maintenance-requests.index' name='Pending Approval' />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Users">
                <Accordion.Control>Users</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='roles.index' name='Member Roles' />
                    <Link endpoint='users.index' name='Manage' />
                    <Link endpoint='dashboard' name='Rules' />
                </Accordion.Panel>
            </Accordion.Item>

        </Accordion>
    )
}
