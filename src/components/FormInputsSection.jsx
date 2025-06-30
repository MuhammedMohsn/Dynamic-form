import { v4 as uuidv4 } from "uuid";
import { SiGoogledocs } from "react-icons/si";
import "../styles/admin-form-styles.css";
import { toast } from "react-toastify";
import SingleInput from "./Inputs/SingleInput";
import RadioCheckboxInput from "./Inputs/RadioCheckboxInput";
import SelectInput from "./Inputs/SelectInput";
import { Fragment } from "react";

function FormInputsSection({
  formFields,
  setFormFields,
  handleSubmit,
  watch,
  unregister,
  setValue,
  trigger,
  errors,
}) {
  console.log("formFields", formFields);
  const handleInputChange = (id, event) => {
    const { value, type, files } = event.target;
    const newFields = formFields.map((field) => {
      if (field.id === id) {
        if (type === "file") {
          let file = files[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (e) => {
            const updatedFields = formFields.map((f) => {
              if (f.id === id) {
                return {
                  ...f,
                  value: {
                    lastModified: file?.lastModified,
                    lastModifiedDate: file?.lastModifiedDate,
                    name: file?.name,
                    size: file?.size,
                    type: file?.type,
                    webkitRelativePath: file?.webkitRelativePath,
                    content: e.target.result,
                  },
                };
              }
              return f;
            });
            setFormFields(updatedFields);
          };
        } else {
          field.value = value;
        }
      }
      return field;
    });
    setFormFields(newFields);
  };
  const handleSelectChange = (id, selectedOption, isMulti = false) => {
    const newFields = formFields.map((field) => {
      if (field.id === id) {
        const value = isMulti
          ? selectedOption?.map((opt) => opt.value) || []
          : selectedOption?.value || "";

        field.value = value;
      }
      return field;
    });

    setFormFields(newFields);
  };
  let handleDetermineSelectionType = (input, isMulti) => {
    const newFields = formFields?.map((field) => {
      if (field.id === input?.id) {
        return { ...field, isMulti: !isMulti };
      }
      return field;
    });
    setFormFields(newFields);
  };

  const handlelabelInputChange = (id, labelId, event) => {
    const { value } = event.target;
    const newFields = formFields?.map((field) => {
      if (field.id === id) {
        if (field?.labelId == labelId) {
          return {
            ...field,
            label: value,
          };
        }
      }
      return field;
    });
    setFormFields(newFields);
  };
  const handleRemoveField = (id) => {
    const newFields = formFields.filter((field) => field.id !== id);
    setFormFields(newFields);
    toast.error("تم حذف المدخل بنجاح", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleOptionChangeForRadioAndCheckBoxes = (fieldId, optionId, type) => {
    const newFields = formFields.map((field) => {
      if (field.id !== fieldId) return field;

      let updatedOptions = [...field.options];

      if (type === "radio") {
        updatedOptions = updatedOptions.map((option) => ({
          ...option,
          selected: option.id === optionId,
        }));
        return {
          ...field,
          options: updatedOptions,
          value: optionId,
        };
      }

      if (type === "checkbox") {
        updatedOptions = updatedOptions.map((option) =>
          option.id === optionId
            ? { ...option, selected: !option.selected }
            : option
        );

        const selectedIds = updatedOptions
          .filter((opt) => opt.selected)
          .map((opt) => opt.id);
        return {
          ...field,
          options: updatedOptions,
          value: selectedIds,
        };
      }

      return field;
    });

    setFormFields(newFields);
  };

  const handleOptionLabelChangeForRadioAndCheckBoxes = (
    fieldId,
    optionId,
    value
  ) => {
    const newFields = [...formFields];
    const fieldIndex = newFields.findIndex((f) => f.id === fieldId);
    const optionIndex = newFields[fieldIndex]?.options?.findIndex(
      (o) => o.id === optionId
    );
    if (fieldIndex !== -1 && optionIndex !== -1) {
      newFields[fieldIndex].options[optionIndex].label = value;
      setFormFields(newFields);
    }
  };

  const handleOptionLabelChangeForSelect = (fieldId, optionId, value) => {
    const newFields = [...formFields];
    const fieldIndex = newFields.findIndex((f) => f.id === fieldId);
    const optionIndex = newFields[fieldIndex]?.options?.findIndex(
      (o) => o.id === optionId
    );
    if (fieldIndex !== -1 && optionIndex !== -1) {
      newFields[fieldIndex].options[optionIndex].label = value;
      setFormFields(newFields);
    }
  };
  const handleRemoveCheckboxAndRadioOption = (fieldId, optionId, type) => {
    const newFields = formFields.map((field) => {
      if (field.id === fieldId && field.type === type) {
        field.options = field.options.filter(
          (option) => option.id !== optionId
        );
      }
      return field;
    });
    setFormFields(newFields);
    toast.error("تم حذف المدخل بنجاح", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleRemoveSelectOption = (fieldId, optionId) => {
    const newFields = formFields.map((field) => {
      if (field.id === fieldId) {
        field.options = field.options.filter(
          (option) => option.id !== optionId
        );
      }
      return field;
    });
    setFormFields(newFields);
    toast.error("تم حذف المدخل بنجاح", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  let handleAddOption = (field) => {
    const newFields = [...formFields];
    let newId = uuidv4();
    const selectedField = newFields?.find((f) => f.id === field.id);
    if (selectedField) {
      selectedField.options.push({
        id: newId,
        label: "",
        selected: false,
      });
    }
    setFormFields(newFields);
  };
  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    console.log("base64", base64);
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };
  let onSubmit = () => {
    console.log("data", watch());
    localStorage.setItem("inputs", JSON.stringify(formFields));
  };
  const handleRequiredChange = (id, event) => {
    const { checked } = event.target;
    const updatedFields = formFields?.map((field) =>
      field.id === id ? { ...field, required: checked } : field
    );
    setFormFields(updatedFields);
  };
  return (
    <>
      <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
        <h3 className="fw-bolder">Form Preview</h3>
        {formFields?.length > 0 ? (
          <>
            {" "}
            <form onSubmit={handleSubmit(onSubmit)}>
              {formFields?.map((field) => {
                return (
                  <Fragment key={field?.id}>
                    {field?.type == "text" ||
                    field?.type == "date" ||
                    field?.type == "time" ? (
                      <SingleInput
                        {...{
                          field,
                          errors,
                          handleRequiredChange,
                          handleRemoveField,
                          handleInputChange,
                          handlelabelInputChange,
                        }}
                      />
                    ) : field?.type == "radio" || field?.type == "checkbox" ? (
                      <>
                        <RadioCheckboxInput
                          {...{
                            field,
                            errors,
                            handleRequiredChange,
                            handleRemoveField,
                            handlelabelInputChange,
                            handleAddOption,
                            handleRemoveCheckboxAndRadioOption,
                            handleOptionLabelChangeForRadioAndCheckBoxes,
                            handleOptionChangeForRadioAndCheckBoxes,
                          }}
                        />
                      </>
                    ) : field?.type == "textarea" ? (
                      <></>
                    ) : field?.type == "file" ? (
                      <></>
                    ) : field?.type == "select" ? (
                      <>
                        {" "}
                        <SelectInput
                          {...{
                            field,
                            errors,
                            handleRequiredChange,
                            handleRemoveField,
                            handlelabelInputChange,
                            handleAddOption,
                            handleRemoveSelectOption,
                            handleOptionLabelChangeForSelect,
                            handleSelectChange,
                            handleDetermineSelectionType,
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Fragment>
                );
              })}
              <div className="d-flex align-items-center justify-content-center w-100 my-3">
                <button
                  type="submit"
                  className="bg-primary outline-none border-0"
                >
                  submit
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="empty-imputs-container d-flex flex-column justify-content-center w-100 align-items-center">
              <div className="empty-doc-icon d-flex align-items-center justify-content-center">
                <SiGoogledocs className="fs-3" />
              </div>
              <h4>No fields added yet</h4>
              <h5>
                Start building your form by adding fields from the panel on the
                left.
              </h5>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default FormInputsSection;
