import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div 
      className=' flex h-screen w-full items-center justify-center'
      style={{
        backgroundImage: "url('/assets/images/auth-dark.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SignUp />
    </div>
  ) 
}