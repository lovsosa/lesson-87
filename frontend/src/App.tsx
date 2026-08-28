import { Route, Routes } from "react-router-dom"
import Posts from "./features/posts/Posts"

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path='*' element={<h4>Not found</h4>} />
      </Routes>
    </>
  )
}

export default App
