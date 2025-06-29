import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { SiGoogledocs } from "react-icons/si";
import "../styles/admin-form-styles.css";
import { toast } from "react-toastify";
import SingleInput from "./Inputs/SingleInput";
import RadioCheckboxInput from "./Inputs/RadioCheckboxInput";
import SelectInput from "./Inputs/SelectInput";

function FormInputsSection({ formFields, setFormFields }) {
  console.log("formFields", formFields);
  // Dynamic validation schema generation
  let [validationSchema, setValidationSchema] = useState({});
  useEffect(() => {
    setValidationSchema(
      Yup.object().shape(
        formFields.reduce((schema, field) => {
          schema[`${field.id}_${field.labelId}_label`] = Yup.string()
            .required("Field is required")
            .max(50, "Field cannot exceed 50 characters");
          if (["text"].includes(field.type)) {
            schema[`${field.id}_value`] = Yup.string()
              .nullable()
              .notRequired()
              .optional()
              .max(50, "Field cannot exceed 50 characters");
          }
          if (["date", "time"].includes(field.type)) {
            schema[`${field.id}_value`] = Yup.string()
              .nullable()
              .notRequired()
              .optional();
          }
          if (["select", "checkbox", "radio"].includes(field.type)) {
            if (!field.options || field.options.length < 2) {
              schema[`${field.id}_options_count`] = Yup.string().required(
                "You must add more than one option"
              );
            }
            field.options?.forEach((option) => {
              schema[`${field.id}_options_${option.id}_label`] =
                Yup.string().required("Option label is required");
            });
          }

          return schema;
        }, {})
      )
    );
  }, [formFields]);
  const {
    handleSubmit,
    watch,
    unregister,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  console.log("errors", errors);
  console.log("values", watch());
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
    setValue(`${id}_${labelId}_label`, value);
    trigger(`${id}_${labelId}_label`);
  };
  const handleRemoveField = (id) => {
    const newFields = formFields.filter((field) => field.id !== id);
    unregister();
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
      if (field.id === fieldId) {
        if (type === "radio") {
          field.options.forEach((option) => {
            option.selected = option.id === optionId;
          });
        } else if (type === "checkbox") {
          const optionIndex = field.options.findIndex(
            (option) => option.id === optionId
          );
          if (optionIndex !== -1) {
            field.options[optionIndex].selected =
              !field.options[optionIndex].selected;
          }
        }
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
      setValue(`${fieldId}_options_${optionId}_label`, value);
      trigger(`${fieldId}_options_${optionId}_label`);
      setFormFields(newFields);
    }
  };
  const handleOptionChangeForSelect = (fieldId, optionId, type) => {
    const newFields = formFields.map((field) => {
      if (field.id === fieldId) {
        if (type === "radio") {
          field.options.forEach((option) => {
            option.selected = option.id === optionId;
          });
        } else if (type === "checkbox") {
          const optionIndex = field.options.findIndex(
            (option) => option.id === optionId
          );
          if (optionIndex !== -1) {
            field.options[optionIndex].selected =
              !field.options[optionIndex].selected;
          }
        }
      }
      return field;
    });
    setFormFields(newFields);
  };

  const handleOptionLabelChangeForSelect = (fieldId, optionId, value) => {
    const newFields = [...formFields];
    const fieldIndex = newFields.findIndex((f) => f.id === fieldId);
    const optionIndex = newFields[fieldIndex]?.options?.findIndex(
      (o) => o.id === optionId
    );
    if (fieldIndex !== -1 && optionIndex !== -1) {
      newFields[fieldIndex].options[optionIndex].label = value;
      setValue(`${fieldId}_options_${optionId}_label`, value);
      trigger(`${fieldId}_options_${optionId}_label`);
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
    trigger(`${fieldId}_options_count`);
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
  const handleRemoveSelectOption = (fieldId, optionId, type) => {
    const newFields = formFields.map((field) => {
      if (field.id === fieldId && field.type === type) {
        field.options = field.options.filter(
          (option) => option.id !== optionId
        );
      }
      return field;
    });
    setFormFields(newFields);
    trigger(`${fieldId}_options_count`);
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
    const selectedField = newFields?.find((f) => f.id === field.id);
    if (selectedField) {
      selectedField.options.push({
        id: uuidv4(),
        label: "",
        selected: false,
      });
    }
    setValue(`${field?.id}_options_count`, selectedField.options?.length);
    trigger(`${field?.id}_options_count`);
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
                  <>
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
                            handleOptionChangeForSelect,
                            handleSelectChange,
                            handleDetermineSelectionType,
                          }}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </>
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
