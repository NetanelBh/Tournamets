import { Outlet } from "react-router-dom";
import BetsHeader from "../bets/BetsHeader";

const BetsLayout = () => {
  return (
    <>
        <BetsHeader />
        <Outlet />
    </>
  )
}

export default BetsLayout