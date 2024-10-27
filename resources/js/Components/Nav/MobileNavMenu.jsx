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
                    <Link endpoint='agenda.upcoming' name='Agenda' linkClick={linkClick} />
                    <Link endpoint='schedule' name='Schedule' linkClick={linkClick} />
                    <Link endpoint='meetings.create' name='Join' linkClick={linkClick} />
                    <Link endpoint='meetings.index' name='Previous Minutes' linkClick={linkClick} />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="House">
                <Accordion.Control>House</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='decisions.index' name='Decisions Made' linkClick={linkClick} />
                    <Link endpoint='tasks.index' name='Tasks' linkClick={linkClick} />
                    <Link endpoint='rules.index' name='Rules' linkClick={linkClick} />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Treasury">
                <Accordion.Control>Treasury</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='treasury.summary' name='Summary' linkClick={linkClick} />
                    <Link endpoint='treasury-reports.index' name='Reports' linkClick={linkClick} />
                    <Link endpoint='treasury-plans.latest' name='Plans' linkClick={linkClick} />
                    <Link endpoint='accounts.index' name='Accounts' linkClick={linkClick} />
                    <Link endpoint='rents.index' name='Rents' linkClick={linkClick} />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Purchases">
                <Accordion.Control>Purchases</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='purchases.index' name='All Purchases' linkClick={linkClick} />
                    <Link endpoint='purchase-requests.create' name='Request' linkClick={linkClick} />
                    <Link endpoint='purchase-requests.index' name='Pending Approval' linkClick={linkClick} />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Maintenance">
                <Accordion.Control>Maintenance</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='maintenance.index' name='All Maintenance' linkClick={linkClick} />
                    <Link endpoint='maintenance.upcoming' name='Upcoming' linkClick={linkClick} />
                    <Link endpoint='maintenance-requests.create' name='Request' linkClick={linkClick} />
                    <Link endpoint='maintenance-requests.index' name='Pending Approval' linkClick={linkClick} />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Documents">
                <Accordion.Control>Documents</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='documents.index' name='Browse Documents' linkClick={linkClick} />
                    <Link endpoint='documents.create' name='Upload' linkClick={linkClick} />
                    <Link endpoint='documentation' name='Documentation' linkClick={linkClick} />
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="Users">
                <Accordion.Control>Users</Accordion.Control>
                <Accordion.Panel>
                    <Link endpoint='roles.index' name='Member Roles' linkClick={linkClick} />
                    <Link endpoint='users.index' name='Manage' linkClick={linkClick} />
                </Accordion.Panel>
            </Accordion.Item>

        </Accordion>
    )
}
