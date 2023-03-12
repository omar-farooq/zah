import { useState, useEffect } from 'react'
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Title } from 'chart.js'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { draw, generate } from 'patternomaly'

export default function DisplayPoll({auth, poll}) {
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

    return (
        <>
            <div className="flex flex-row">
                <div><canvas id={`poll-${poll.id}-results`} style={canvasStyle}></canvas></div>
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
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                    :
                    ''
                }

            </div>
        </>
	)
}
