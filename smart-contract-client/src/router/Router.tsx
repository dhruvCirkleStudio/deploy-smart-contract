import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import Navbar from '../component/Navbar'

export default function Router() {

  const routingArr = createBrowserRouter([
    {
      path:'/',
      element:<Navbar/>,
      children:[
        {
          path:'/',
          element:<Home/>
        }
      ]
    }
  ])

  return (
    <RouterProvider router={routingArr}/>
  )
}
