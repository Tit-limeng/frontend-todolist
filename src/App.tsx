
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './auth/login/Login'
import Register from './auth/register/Register'
import Home from './home/Home';
import Forgot_Password from './auth/forgot_passwrod/Forgot_Password';
import NotFound from './Not_Found';
import { ProtectedRoute , GuestRoute} from './middleware/ProtectedRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<Forgot_Password />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  ) ;
}

export default App
