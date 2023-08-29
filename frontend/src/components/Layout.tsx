export default function Layout({ children }) {
  return (
  <div id="layout" className="flex min-h-screen flex-col bg-background">
    <h1 className="bg-primary">TODO: Navbar</h1>
      {children}
    <h1 className="mt-auto bg-secondary">TODO: Footer</h1>
  </div>
)}
