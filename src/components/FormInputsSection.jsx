import { v4 as uuidv4 } from "uuid";
import { SiGoogledocs } from "react-icons/si";
import "../styles/admin-form-styles.css";
import { toast } from "react-toastify";
import SingleInput from "./Inputs/SingleInput";
import RadioCheckboxInput from "./Inputs/RadioCheckboxInput";
import SelectInput from "./Inputs/SelectInput";
import { Fragment, useCallback } from "react";
import FileUploadInput from "./Inputs/FileUploadInput";
import TextAreaInput from "./Inputs/TextAreaInput";
import EditorInput from "./Inputs/EditorInput";
import showAlert from "../functions/showAlert";
import { useNavigate } from "react-router-dom";
function FormInputsSection({
  formFields,
  setFormFields,
  handleSubmit,
  watch,
  unregister,
  setValue,
  trigger,
  errors,
  userType,
}) {
  console.log("formFields", formFields);
  const handleInputChange = (id, event) => {
    const { value, type, files } = event.target;

    if (type === "file") {
      const fileList = Array.from(files);
      const readFiles = [];

      fileList.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          readFiles.push({
            id: uuidv4(),
            lastModified: file?.lastModified,
            lastModifiedDate: file?.lastModifiedDate,
            name: file?.name,
            size: file?.size,
            type: file?.type,
            webkitRelativePath: file?.webkitRelativePath,
            content: e.target.result,
            fileAsBinary: file,
          });
          const updatedFields = formFields.map((field) =>
            field.id === id ? { ...field, value: readFiles } : field
          );
          setFormFields(updatedFields);
        };
      });
    } else {
      const updatedFields = formFields.map((field) => {
        if (field.id === id) {
          return {
            ...field,
            value,
          };
        }
        return field;
      });
      setFormFields(updatedFields);
    }
  };
  // i use usecallback because quilleditor
  const handleTextEditorChange = useCallback((id, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  }, []);

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

  let handleDeleteFileForField = (fieldId, fileId) => {
    let newFormFields = [...formFields];
    let updatedFields = newFormFields?.map((item) => {
      if (item?.id == fieldId) {
        return {
          ...item,
          value: item?.value?.filter((file) => {
            return file?.id != fileId;
          }),
        };
      }
      return item;
    });
    setFormFields(updatedFields);
    toast.error("تم حذف الملف بنجاح", {
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
  let navigate = useNavigate();
  let onSubmit = () => {
    localStorage.setItem("inputs", JSON.stringify(formFields));
    if (userType == "user") {
    } else {
      showAlert(
        "تمت الإجابه بنجاح وجاري توجيهك لصفحه اجابه الاسئله",
        "success",
        () => {
          navigate("/user-dynamic-form");
        }
      );
    }
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
                          userType,
                        }}
                        readOnly={userType == "user" ? false : true}
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
                            userType,
                          }}
                        />
                      </>
                    ) : field?.type == "textarea" ? (
                      <>
                        <TextAreaInput
                          {...{
                            field,
                            errors,
                            handleRequiredChange,
                            handleRemoveField,
                            handleInputChange,
                            handlelabelInputChange,
                            userType
                          }}
                          readOnly={userType == "user" ? false : true}
                        />
                      </>
                    ) : field?.type == "file" ? (
                      <>
                        <FileUploadInput
                          {...{
                            field,
                            errors,
                            handleRequiredChange,
                            handleRemoveField,
                            handleInputChange,
                            handlelabelInputChange,
                            handleDeleteFileForField,
                            userType
                          }}
                          readOnly={true}
                        />
                      </>
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
                            userType
                          }}
                          readOnly={userType == "user" ? false : true}
                        />
                      </>
                    ) : field?.type == "editor" ? (
                      <>
                        <EditorInput
                          {...{
                            field,
                            errors,
                            handleRequiredChange,
                            handleRemoveField,
                            handleTextEditorChange,
                            handlelabelInputChange,
                            userType
                          }}
                          readOnly={userType == "user" ? false : true}
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
                  className="btn bg-primary outline-none border-0 w-25 p-3"
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
