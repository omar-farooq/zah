import { useState, useEffect } from 'react';
import { Buffer } from 'buffer'

export default function Profile({user}) {

	const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        const getAvatar = async () => {
            let image = await axios.get('/users/'+user.id+'?view=avatar', {responseType: 'arraybuffer'})
            setAvatarPreview(Buffer.from(image.data, 'binary').toString('base64'))
        }
        getAvatar()
    }, []);

    return (
        <>
            <div className="bg-gray-100 pt-6 sm:pt-12 w-full">
                <div className="max-w-xl mx-auto">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                        <div className="text-3xl mb-4 text-center">
                            Profile of {user.name}
                        </div>
                        <div className="flex justify-center">
                            <div className="w-40 h-40 rounded-full overflow-hidden">
                                <img src={`data:image/jpeg;charset=utf-8;base64,${avatarPreview}`} alt="avatar" className="w-40 h-40 text-center" />
                            </div>
                        </div>
                        <div className="space-y-5 mt-6 text-lg">
                            <div>
                                <div className="w-full text-center">
                                        Email: {user.email}
                                </div>
                                <div className="w-full text-center">
                                        Phone: {user.phone ?? '(not given)'} 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

			{user.next_of_kin &&
				<div className="bg-gray-100 pb-6 w-full">
					<div className="max-w-xl mx-auto">
						<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
							<div className="text-2xl text-center">Next Of Kin</div>
							<div className="space-y-5 mt-6">
								<div className="flex flex-col text-lg">
									<div className="text-center">
											Name: {user.next_of_kin.name}
									</div>
									<div className="text-center">
											Email: {user.next_of_kin.email ?? 'N/A'}
									</div>
									<div className="text-center">
											Phone: {user.next_of_kin.phone ?? 'N/A'}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			}

		</>

    )
}
