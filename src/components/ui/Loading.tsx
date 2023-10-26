import Image from 'next/image'
import LoadingSVG from '/public/assets/loading.svg'

const Loading = () => {
    return (
        < div className="flex animate-fade-in-delay justify-center p-8" >
            <Image src={LoadingSVG} alt="loading..." width={200} height={200} />
        </div >
    )
}

export default Loading