import { Outlet } from "react-router-dom"
import Navbar from "./navbar"
import Footer from "./footer"

const Layout = () => {
    return (
        <>
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Router Outlet */}
            <main className="p-4 flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <div className="mt-auto bottom-0 left-0 right-0">
                <Footer />
            </div>

        </div>
        </>
    )
}

export default Layout