export default function Navbar() {
    return (
        <div>
            <ul className="flex justify-between">
                <li className="p-4">
                    <a href="/" className="underline">Home</a>
                </li>
                <li className="p-4">
                    <a href="/profile" className="underline">Profile</a>
                </li>
            </ul>
        </div>
    );
  }