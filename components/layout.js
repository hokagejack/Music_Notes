import Nav from './Nav';

// define layout component
export default function Layout({ children }) {
  return (
    <div className="mx-6 md:max-w-2x1 px-10 md:mx-auto font-nunito">

      <Nav />

      <main>{children}</main>
    </div>
  )
}
