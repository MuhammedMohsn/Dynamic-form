import React, { useEffect } from "react";
import { useState } from "react";
import UserViewAnswersDynamicForm from "../components/UserViewAnswersDynamicForm";
function UserViewAnswersPage() {
  const [formFields, setFormFields] = useState([]);
  useEffect(() => {
    setFormFields(JSON.parse(localStorage.getItem("inputs")));
  }, [localStorage.getItem("inputs")]);

  return <UserViewAnswersDynamicForm {...{ formFields}} />;
}

export default UserViewAnswersPage;
