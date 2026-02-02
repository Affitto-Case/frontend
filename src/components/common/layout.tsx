import { Outlet } from "react-router-dom"
import Navbar from "./navbar"

const Layout = () => {
    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Router Outlet */}
            <main className="p-4">
                <Outlet />
            </main>
        </>
    )
}

export default Layout