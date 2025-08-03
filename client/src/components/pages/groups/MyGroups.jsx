import { useSelector } from "react-redux"

const MyGroups = () => {
  const userGroups = useSelector((state) => state.user.user.groups);
  console.log(userGroups);
  

  return (
    <div>MyGroups</div>
  )
}

export default MyGroups