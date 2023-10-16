import { useStateSelector } from "../hooks/use-redux";

export default function Registration() {
  const { user } = useStateSelector((state) => state.user);

  return (
    <div>
       <h1>Registration</h1>
       <h2>{user?.email}</h2>
       <h2>{user?.socialProvider}</h2>
    </div>
  )
}
