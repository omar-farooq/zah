import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Complaints() {
    return (
        <>
            <Header />

            <div className="flex justify-center animate-fade font-raleway">
                <div className="flex flex-col mt-10 mb-4 w-4/5 space-y-8">

                    {/* Introduction */}
                    <div className="w-full m-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Complaints Handling at Zah Housing Co-op</h1>
                        <div className="text-base md:text-lg">
                            We are committed to providing a safe, fair, and supportive environment for all our members and residents. We value your feedback and take all complaints seriously, using them as opportunities to learn and improve our services.
                        </div>
                    </div>

                    {/* Our Commitment */}
                    <div className="w-full m-1 bg-gray-100 rounded-lg p-4">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-1">Our Commitment to You</h2>
                        <div className="text-sm md:text-base">
                            Zah Housing Co-op follows the <a href="https://www.housing-ombudsman.org.uk/landlords-info/complaint-handling-code/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Housing Ombudsman’s Complaint Handling Code</a> to ensure all complaints are handled fairly, transparently, and promptly. We promise to:
                            <ul className="list-disc ml-6 mt-2">
                                <li>Listen to your concerns without judgement</li>
                                <li>Respond to your complaint within agreed timescales</li>
                                <li>Keep you informed throughout the process</li>
                                <li>Respect your confidentiality</li>
                                <li>Use your feedback to improve our co-op</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step-by-Step Process */}
                    <div className="w-full m-1">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-1">How to Make a Complaint</h2>
                        <ol className="list-decimal ml-6 text-sm md:text-base space-y-2">
                            <li>
                                <strong>Informal Resolution:</strong> Speak to a committee member or another trusted member. Many issues can be resolved quickly and informally.
                            </li>
                            <li>
                                <strong>Formal Complaint:</strong> If you are not satisfied, or the issue is serious, submit a formal complaint in writing (email or letter) to the complaints officer. You can find out who is the complaints officer from the list of member roles in the member portal. Please include details of your concern, any steps already taken, and your desired outcome.
                            </li>
                            <li>
                                <strong>Acknowledgement:</strong> We will acknowledge your complaint within 5 working days.
                            </li>
                            <li>
                                <strong>Investigation:</strong> The committee will investigate your complaint, which may involve speaking to those involved and reviewing relevant documents.
                            </li>
                            <li>
                                <strong>Response:</strong> We aim to provide a full written response within 10 working days of acknowledging your complaint.
                            </li>
                            <li>
                                <strong>Appeal:</strong> If you are not satisfied with the outcome, you may request a review by a different committee member or the full committee.
                            </li>
                            <li>
                                <strong>Ombudsman:</strong> If you remain dissatisfied after our process, you can contact the <a href="https://www.housing-ombudsman.org.uk/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Housing Ombudsman Service</a> for independent advice and investigation.
                            </li>
                        </ol>
                    </div>

                    {/* FAQs */}
                    <div className="w-full m-1 bg-gray-50 rounded-lg p-4">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-1">Frequently Asked Questions</h2>
                        <div className="text-sm md:text-base space-y-2">
                            <div>
                                <strong>Who can make a complaint?</strong><br />
                                Any resident, member, or applicant can make a complaint about our services, decisions, or the behaviour of members.
                            </div>
                            <div>
                                <strong>Will my complaint be confidential?</strong><br />
                                Yes. We treat all complaints with confidentiality and only share information with those who need to know.
                            </div>
                            <div>
                                <strong>Can I get support to make a complaint?</strong><br />
                                Absolutely. If you need help, you can ask a friend, family member, or support worker to help you submit your complaint.
                            </div>
                            <div>
                                <strong>Will making a complaint affect my tenancy?</strong><br />
                                No. We encourage feedback and will never treat you unfairly for raising concerns.
                            </div>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div className="w-full m-1">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-1">Useful Links & Resources</h2>
                        <ul className="list-disc ml-6 text-sm md:text-base">
                            <li>
                                <a href="https://www.housing-ombudsman.org.uk/residents/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                                    How to make a complaint (Housing Ombudsman)
                                </a>
                            </li>
                            <li>
                                <a href="https://www.gov.uk/government/publications/your-rights-and-responsibilities-as-a-housing-association-tenant" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                                    Your rights as a housing association tenant
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="w-full m-1 bg-gray-100 rounded-lg p-4">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-1">Contact Us</h2>
                        <div className="text-sm md:text-base">
                            If you have any questions or wish to make a complaint, please either contact us in person at:<br />
                            <span className="font-semibold">Address:</span> Zah Housing Co-op, Didsbury, Manchester, UK <br />
                            Or <a href="/login" className="underline text-blue-600">login</a> to the members portal and use our internal complaints form
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}
