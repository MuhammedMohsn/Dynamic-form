import Select from "react-select";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import {
  FaFont,
  FaListUl,
  FaDotCircle,
  FaCheckSquare,
  FaCalendarAlt,
  FaClock,
  FaFileUpload,
  FaCaretDown,
} from "react-icons/fa";
function SelectInputSection({
  selectedType,
  setSelectedType,
  formFields,
  setFormFields,
}) {
  const inputTypes = [
    { value: "text", label: "Text", icon: <FaFont className="mx-2" /> },
    {
      value: "textarea",
      label: "TextArea",
      icon: <FaListUl className="mx-2" />,
    },
    { value: "radio", label: "Radio", icon: <FaDotCircle className="mx-2" /> },
    {
      value: "checkbox",
      label: "Checkbox",
      icon: <FaCheckSquare className="mx-2" />,
    },
    { value: "date", label: "Date", icon: <FaCalendarAlt className="mx-2" /> },
    { value: "time", label: "Time", icon: <FaClock className="mx-2" /> },
    { value: "file", label: "Files", icon: <FaFileUpload className="mx-2" /> },
    {
      value: "select",
      label: "Select",
      icon: <FaCaretDown className="mx-2" />,
    },
  ];
  const selectOptions = inputTypes.map((type) => ({
    value: type.value,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {type.icon}
        <span>{type.label}</span>
      </div>
    ),
  }));
  const handleAddField = () => {
    if (selectedType) {
      const newFields = [...formFields];
      newFields.push({
        id: uuidv4(),
        label: "",
        labelId: uuidv4(),
        type: selectedType,
        value: "",
        options:
          selectedType == "checkbox" || selectedType == "radio"
            ? [
                {
                  id: uuidv4(),
                  label: "",
                  selected: false,
                },
              ]
            : [],
        required: false,
      });
      setFormFields(newFields);
      toast.success("تم اضافه المدخل بنجاح", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <>
      <div className="p-4 border border-2 rounded bg-white">
        <h3 className="me-2 fw-bolder">Add Field Type:</h3>
        <Select
          className="my-3"
          options={selectOptions}
          onChange={(option) => setSelectedType(option.value)}
          placeholder="Select type"
        />
        <button className="btn btn-primary ms-2 w-100" onClick={handleAddField}>
          Add Field
        </button>
        <hr />
        {formFields?.length > 0 ? `${formFields?.length} fields added` : ""}
      </div>
    </>
  );
}

export default SelectInputSection;
