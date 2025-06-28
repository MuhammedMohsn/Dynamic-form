import SelectInputSection from "./SelectInputSection";
import FormInputsSection from "./FormInputsSection";
import { ToastContainer } from "react-toastify";
const AdminDynamicForm = ({
  selectedType,
  setSelectedType,
  formFields,
  setFormFields,
}) => {
  return (
    <>
      <div className="container">
        {" "}
        <h1 className="d-flex align-items-center justify-content-center text-primary mt-4">
          Dynamic Form Builder
        </h1>
        <h3 className="d-flex align-items-center justify-content-center text-muted mt-2">
          Create beautiful, responsive forms with ease
        </h3>
        <SelectInputSection
          {...{ selectedType, setFormFields, formFields, setSelectedType }}
        />
        <FormInputsSection {...{ setFormFields, formFields }} />
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminDynamicForm;
