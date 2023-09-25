import { Link } from "@tanstack/react-router";

export default function Navbar() {
    return (
        <nav className="bg-primary flex">
            <ul className="flex">
                <li className="mr-6">
                    <Link to="/">Home</Link>
                </li>
                <li className="mr-6">
                    <Link to="/profile">Profile</Link>
                </li>
            </ul>
        </nav>
    );
  }