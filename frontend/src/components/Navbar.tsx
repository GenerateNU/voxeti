import { Link } from "@tanstack/react-router";

interface NavbarProps {
    id: string;
}

export default function Navbar({ id }: NavbarProps) {
    return (
        <nav className="bg-primary flex">
            <ul className="flex">
                <li className="mr-6">
                    <Link to="/">Home</Link>
                </li>
                <li className="mr-6">
                    <Link to="/profile/$id" params={{
                        id: id,
                    }}>Profile</Link>
                </li>
            </ul>
        </nav>
    );
}