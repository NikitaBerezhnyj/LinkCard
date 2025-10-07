// import { Route, Routes, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import Home from "./components/Home";
// import Template from "./components/Template";
// import "./styles/base.css";

// function App() {
//   const jwtToken = localStorage.getItem("jwtToken");

//   return (
//     <div className="container">
//       {jwtToken ? (
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/user/:username" element={<Template />} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       ) : (
//         <Routes>
//           <Route path="/signup" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/user/:username" element={<Template />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       )}
//     </div>
//   );
// }

// export default App;

import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Registration";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import Template from "./components/Template";
import "./styles/base.css";

function App() {
  const jwtToken = localStorage.getItem("jwtToken");

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:username" element={<Template />} />

        {!jwtToken && (
          <>
            <Route path="/registration" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </>
        )}
        {jwtToken && (
          <>
            <Route path="/registration" element={<Navigate to="/" />} />
            <Route path="/login" element={<Navigate to="/" />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
