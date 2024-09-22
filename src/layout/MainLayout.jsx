import Header from "../components/Header"
import Sidebar from "../components/Sidebar"


function MainLayout({children}) {
  return (
    <>
      <Sidebar></Sidebar>
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </>
  )
}

export default MainLayout