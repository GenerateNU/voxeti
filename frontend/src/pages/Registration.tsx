import { useStateSelector } from "../hooks/use-redux";

export default function Registration() {
  const { user } = useStateSelector((state) => state.user)

  return (
    <div className='mt-20'>
       <h1>Registration</h1>
       <h2>{user?.email}</h2>
       <h2>{user?.socialProvider}</h2>
    </div>
  )
}
