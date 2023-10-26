import GoogleLogo from '../../assets/signIn/googleLogo.png'
import GrayDots from '../../assets/signIn/grayDots.png'
import { SocialProviderPendingProps } from './SocialProviderPending.types'

export default function SocialProviderPending({provider, onClick, setState} : SocialProviderPendingProps) {
  // A provider
  type Provider = {
    image: string;
  }

  // List of possible providers:
  const providerImages : Map<string, Provider> = new Map();
  providerImages.set("Google", { image: GoogleLogo });

  // Extract the provider logo:
  const providerLogo = providerImages.get(provider)?.image ?? '';

  return (
    <>
    <div className='min-w-full h-[100vh] bg-[#5A5A5A] opacity-70 absolute z-40' />
    <div className='absolute w-[350px] h-[50vh] min-h-[500px] bg-[#FFFFFF] flex flex-col top-[22.5vh] left-[calc(50vw-175px)] rounded-xl z-50 justify-center items-center p-14 text-center'>
        <img src={providerLogo} className='w-20 mb-5'/>
        <h2 className='mb-10 text-xl'>You are currently continuing with {provider}</h2>
        <img src={GrayDots} className='w-20 mb-10' />
        <h3 className='mb-5'>
          Please click
          <a className='hover:cursor-pointer text-[#4285F4]' onClick={onClick}> here </a>
          to return to {provider} login / registration.
        </h3>
        <hr className='w-[60%] rounded-lg h-[2px] border-none bg-[#A2A2A2] mb-5' />
        <a className='hover:cursor-pointer text-[#4285F4]' onClick={() => setState(false)}>
          I do not wish to proceeed with {provider}
        </a>
    </div>
    </>
  )
}
