import "./App.css";
import { Fragment } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import UserAnswersPage from "./pages/UserAnswersPage"
import UserViewAnswersPage from "./pages/UserViewAnswersPage"
function App() {
  return (
    <Fragment>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {" "}
        <Routes>
          <Route path="/" element={<Navigate to={"/admin-dynamic-form"} />} />
          <Route path="/admin-dynamic-form" element={<AdminPage />} />
          <Route path="/user-dynamic-form" element={<UserAnswersPage />} />
          <Route path="/view-user-dynamic-form" element={<UserViewAnswersPage />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
