import React, { useEffect } from "react";
import { useState } from "react";
import UserAnswersDynamicForm from "../components/UserAnswersDynamicForm"
function UserAnswersPage() {
  const [formFields, setFormFields] = useState([]);
  useEffect(() => {
    setFormFields(JSON.parse(localStorage.getItem("inputs")));
  }, [localStorage.getItem("inputs")]);

  return <UserAnswersDynamicForm {...{ formFields, setFormFields }} />;
}

export default UserAnswersPage;
