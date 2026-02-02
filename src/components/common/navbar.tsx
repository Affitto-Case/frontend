import { Link } from "react-router-dom"
import { ThemeToggle } from "@/components/common/themeToggle"
const Navbar = () => {
    return (
    <div className="shadow-md border-b-2 border-blue-500">
        <header className="p-4 flex justify-between items-center">
            <Link to="/" className="font-bold text-2xl">Turista Facoltoso - Backoffice</Link>
            <nav>
                <ul className="flex items-center gap-4">
                    <li><Link to="/user">User</Link></li>
                    <li><Link to="/residence">Residence</Link></li>
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