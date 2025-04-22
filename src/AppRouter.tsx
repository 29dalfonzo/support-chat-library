import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { lazy, Suspense } from 'react'
import { AuthLayout } from './auth/layout/AuthLayout'
import { LoginPage } from './auth/pages/LoginPage'
import { RegisterPage } from './auth/pages/RegisterPage'

// import  ChatLayout  from './chat/layout/ChatLayout'
const ChatLayout = lazy(() => sleep(1250).then(() => import('./chat/layout/ChatLayout')))

// import ChatPage from './chat/pages/ChatPage'
const ChatPage = lazy(() =>  import('./chat/pages/ChatPage'))
import { sleep } from './lib/sleep'
const NoChatSelected = lazy(() =>  import('./chat/pages/NoChatSelected'))
export const AppRouter = () => {
  return (
    <BrowserRouter>
    <Routes>
      {/* Rutas protegidas */}
        <Route path='/auth' element={<AuthLayout />} >
            <Route index element={<LoginPage />} />
            <Route path='/auth/register' element={<RegisterPage />} />
        </Route>

        <Route path='/chat' element={
          <Suspense fallback={<div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>}>
            <ChatLayout />
          </Suspense>
        } >
        <Route path=':clientId' element={<ChatPage />} />
        <Route index element={<NoChatSelected />} />
        </Route>


      {/* Rutas públicas */}
    <Route path="/" element={<Navigate to="/auth" />} />
    <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
    </BrowserRouter>
  )
}
