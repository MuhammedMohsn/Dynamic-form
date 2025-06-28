import React from "react";
import AdminDynamicForm from "../components/AdminDynamicForm";
import { useState } from "react";
function AdminPage() {
  const [selectedType, setSelectedType] = useState("");
  const [formFields, setFormFields] = useState([]);

  return (
    <AdminDynamicForm
      {...{ selectedType, setSelectedType, formFields, setFormFields }}
    />
  );
}

export default AdminPage;
