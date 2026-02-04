import { Link } from "react-router-dom"
import { ThemeToggle } from "@/components/common/themeToggle"
import { Home } from "lucide-react"

const Navbar = () => {
    const CRUD_URL="/crud/";
    return (
    <div className="shadow-md border-b-2 border-blue-500">
        <header className="p-4 flex justify-between items-center">
            <Link to="/" className="font-bold text-2xl">Turista Facoltoso - Backoffice</Link>
            <nav>
                <ul className="flex items-center gap-4">
                    <li>
                        <Link to="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Home size={20} />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`${CRUD_URL}user`}>User</Link>
                    </li>
                    <li>
                        <Link to={`${CRUD_URL}host`}>Host</Link>
                    </li>
                    <li>
                        <Link to={`${CRUD_URL}residence`}>Residence</Link>
                    </li>
                    <li>
                        <Link to={`${CRUD_URL}booking`}>Booking</Link>
                    </li>
                    <li>
                        <Link to={`${CRUD_URL}feedback`}>Feedback</Link>
                    </li>
                    <li><div className="p-4 flex justify-end">
                        <ThemeToggle/>
                    </div>
                    </li>
                </ul>
            </nav>
        </header>
    </div>
    )
}

export default Navbar