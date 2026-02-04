import { Outlet } from "react-router-dom"
import Navbar from "./navbar"
import Footer from "./footer"

const Layout = () => {
    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Router Outlet */}
            <main className="p-4">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default Layout