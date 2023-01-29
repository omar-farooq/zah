import { useState, useEffect } from 'react'
import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js'
import { CheckIcon } from '@heroicons/react/24/solid'

export default function DisplayPoll({auth, poll}) {
    Chart.register(
        BarController,
        BarElement,
        CategoryScale,
        LinearScale
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
                            data: poll.poll_items.map(option => option.votes.length)
                        }
                    ]
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
            <ul key={poll.id}>
                {poll.name}
                {poll.poll_items.map(option => (
                    <li key={option.id}>
                        <div className="flex flex-row mt-2">
                            {option.option}
                            <CheckIcon
                                className="h-6 w-6 text-green-400 cursor-pointer hover:text-green-600 ml-2"
                                onClick={() => vote(option.id)}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            <div><canvas id={`poll-${poll.id}-results`} style={canvasStyle}></canvas></div>
        </>
	)
}
