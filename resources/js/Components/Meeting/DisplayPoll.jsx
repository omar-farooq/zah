import { useState, useEffect } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Title } from 'chart.js'
import { CheckCircleIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { draw, generate } from 'patternomaly'
import { Modal } from '@mantine/core'
import ConfirmModal from '@/Components/ConfirmModal'

export default function DisplayPoll({auth, poll}) {

    const [members, setMembers] = useState([])

    //Modal state for confirming poll deletion
    const [modalOpened, modalHandlers] = useDisclosure(false)

    //Modal and state for voting on behalf of someone else
    //Reserved for the chair person
    const [behalfOfOpened, behalfOfHandlers] = useDisclosure(false)
    const [behalfOfPollOption, setBehalfOfPollOption] = useState({poll: '', option: ''})

    Chart.register(
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Title
    )

    const [userVote, setUserVote] = useState({
        voteId: '',
        optionId: ''
    })

    const canvasStyle = {
        width: '800px'
    }

    //Get members for the ability to choose who to vote on behalf of
    useEffect(() => {
        const getMembers = async () => {
            let res = await axios.get('/memberships')
            setMembers(res.data.members)
        }
        getMembers()
    },[])

	//Find if the user has voted and set their vote if it exists
    useEffect(() => {
        poll.poll_items.forEach(option => 
            option.votes.find(vote => 
                vote.user_id == auth.user.id ? 
                    setUserVote({voteId: vote.id, optionId: option.id}) 
                : 
                    ''
            )
        )

        const pollChart = new Chart(
            document.getElementById(`poll-${poll.id}-results`),
            {
                type: 'bar',
                data: {
                    labels: poll.poll_items.map(option => option.option),
                    datasets: [
                        {
                            label: 'number of votes',
                            data: poll.poll_items.map(option => option.votes.length),
                            backgroundColor: [
                                draw('square', '#FD8A8A'),
                                draw('circle', '#A8D1D1'),
                                draw('zigzag-horizontal', '#9EA1D4'),
                                draw('diamond', '#F1F7B5'),
                                draw('triangle', 'rgb(255, 99, 132, 0.4)'),
                            ]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            font: {
                                size: 20
                            },
                            display: true,
                            text: poll.name
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Number of votes'
                            },
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            }
        )
        pollChart.update()

        return () => {
            pollChart.destroy()
        }
    },[poll])
    
    const vote = async (selectedOptionId) => {
        let newVote
        userVote.voteId ? 
            newVote = await axios.patch('/vote/'+userVote.voteId, {
                poll_option_id: selectedOptionId
            }) 
        :
            newVote = await axios.post('/vote', {
                user_id: auth.user.id,
                poll_option_id: selectedOptionId
            })
    }

    const voteOnBehalfOf = (userId) => {
        axios.post('/vote?onBehalfOf', {
            user_id: userId,
            poll_option_id: behalfOfPollOption.option
        })
    }

    const deletePoll = () => {
        axios.delete('/poll/'+poll.id)
    }

    return (
        <>
            <div className="flex flex-row my-4">
                <div className="w-full"><canvas id={`poll-${poll.id}-results`} className="w-full"></canvas></div>
                <XMarkIcon 
                    className="h-10 w-10 text-red-600 cursor-pointer"
                    onClick={() => modalHandlers.open()}
                >
                    X
                </XMarkIcon>
                {!poll.meeting_id ?

                    <div className="flex flex-col justify-center ml-4">
                        <ul key={poll.id}>
                            {poll.poll_items.map(option => (
                                <li key={option.id}>
                                    <div className="flex flex-row mt-2">
                                        {option.option}
                                        <CheckCircleIcon
                                            className="h-6 w-6 text-black cursor-pointer hover:text-green-600 ml-2"
                                            onClick={() => vote(option.id)}
                                        />
                                        {auth.user.role.name === 'Chair' &&
                                        <PlusCircleIcon
                                            className="h-6 w-6 text-black cursor-pointer hover:text-green-600 ml-2"
                                            onClick={() => {behalfOfHandlers.open(); setBehalfOfPollOption({poll: poll.id, option: option.id})}}
                                        />}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    :
                    ''
                }

            </div>
  				<ConfirmModal
                	text={<p>Are you sure you want to delete this poll?</p>}
                	confirmFunction={() => {deletePoll(); modalHandlers.close()}}
                	cancelFunction={() => {modalHandlers.close()}}
                	modalOpened={modalOpened}
				/>

  				<Modal opened={behalfOfOpened} onClose={() => behalfOfHandlers.close()}>
                	Who do you want to vote on behalf of?
                        <div className="flex flex-col gap-y-2">
                        {members.map(member => (
                            <button 
                                key={member.id}
                                onClick={() => voteOnBehalfOf(member.id)}
                                className="bg-blue-500 cursor-pointer h-8 text-white"
                            >
                                {member.name}
                            </button>
                        ))}
                        </div>
				</Modal>
        </>
	)
}
