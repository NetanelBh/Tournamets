import { useSelector } from "react-redux"

const MyGroups = () => {
  const userGroups = useSelector((state) => state.user.user.groups);
  // TODO:GET THE USER FULL GROUPS(USE POPULATE BECAUSE ITS A REFERENCE IN USER SCHEMA)
  // TODO:
  console.log(userGroups);
  

  return (
    <div>MyGroups</div>
  )
}

export default MyGroups