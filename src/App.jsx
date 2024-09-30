// eslint-disable-next-line no-unused-vars
import React from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { logo } from './assets'
import { Home, CreatePost } from './pages';
import { Login, Register } from './pages';


const App = () => {
  const isLoggedIn = localStorage.getItem('accessToken');
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]'>
        <Link to='/'>
          <img src={logo} alt='logo' className='w-28 object-contain' />
        </Link>

        <div>
          {isLoggedIn && (
            <Link to='/create-post' className='font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md'>
              Create
            </Link>
          )}

          {!isLoggedIn ? (
            <Link to="/login" className='ml-4'>
              Login
            </Link>
          ) : (
            <button className='ml-4' onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
        
      </header>
      <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App