export default function Documentation() {
    return (
        <>
        <div className="text-2xl lg:text-4xl mt-4">Some documentation about this site </div>

        <div className="text-xl text-orange-600 flex flex-col space-y-6 mt-4">
                <p className="text-black">The schedule page works as follows:</p>
                <p>To schedule a meeting, click on the dates on the left hand side:</p>

            <img src="/images/documentation/schedule1.webp" className="lg:w-2/3" />

            <p>This will bring up a pop-up to schedule a meeting</p>            
            <img src="/images/documentation/schedule2.png" className="lg:w-1/2" />

            <p>Clicking on the boxes under your name</p>            
            <img src="/images/documentation/schedule3.webp" className="lg:w-1/2" />

            <p>Will bring up a selection to let you set your availability</p>            
            <img src="/images/documentation/schedule4.png" className="lg:w-1/2" />
        </div>
        </>
    )
}
