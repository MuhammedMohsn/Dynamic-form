import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DynamicSelectInput from "./DynamicSelectInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
const AdminDynamicForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedType, setSelectedType] = useState("text");
  console.log("formFields3", formFields);
  // Dynamic validation schema generation
  let [validationSchema, setValidationSchema] = useState({});
  useEffect(() => {
    setValidationSchema(
      Yup.object().shape(
        formFields.reduce((schema, field) => {
          schema[`${field.id}_${field?.labelId}_label`] = Yup.string().required(
            `${field.label || "Field"} is required`
          );
          if (field?.required) {
            if (field.type === "text" || field.type === "textarea") {
              schema[field.id] = Yup.string()
                .required(`${field.label || "Field"} is required`)
                .max(
                  50,
                  `${field.label || "Field"} cannot exceed 50 characters`
                );
            } else if (field.type === "date") {
              schema[field.id] = Yup.date()
                .required(`${field.label || "Field"} is required`)
                .typeError(`${field.label || "Field"} is required`)
                .min(
                  new Date(),
                  `${field.label || "Field"} must be a future date`
                );
            } else if (field.type === "time") {
              schema[field.id] = Yup.string()
                .required(`${field.label || "Field"} is required`)
                .test(
                  "is-future-time",
                  `${field.label || "Field"} must be a future time`,
                  (value) => {
                    const now = new Date();
                    const selectedTime = new Date(`1970-01-01T${value}`);
                    return selectedTime > now;
                  }
                );
            } else if (field.type === "file") {
              schema[field.id] = Yup.mixed()
                .required(`${field.label || "Field"} is required`)
                .test("fileType", "Unsupported File Format", (value) =>
                  value
                    ? ["image/png", "image/jpeg"].includes(value.type)
                    : false
                )
                .test("fileSize", "File is too large", (value) =>
                  value ? value.size <= 2000000 : false
                );
            } else if (field.type === "checkbox") {
              schema[field.id] = Yup.string().required(
                `you must select option`
              );
              field?.options?.forEach((option) => {
                schema[`${field.id}_options_${option?.id}`] =
                  Yup.string().required("Option label is required");
              });
            } else if (field.type === "radio") {
              schema[field.id] = Yup.string().required(
                `you must select option`
              );
              field?.options?.forEach((option) => {
                schema[`${field.id}_options_${option?.id}`] =
                  Yup.string().required("Option label is required");
              });
            }
            if (field.type === "select") {
              schema[field.id] = Yup.string().required(
                `${field.label || "Field"} is required`
              );
            }
          } else {
            if (field.type === "text" || field.type === "textarea") {
              schema[field.id] = Yup.string()
                .notRequired()
                .nullable()
                .max(
                  50,
                  `${field.label || "Field"} cannot exceed 50 characters`
                );
            } else if (field.type === "date") {
              schema[field.id] = Yup.date()
                .notRequired()
                .nullable()
                .min(
                  new Date(),
                  `${field.label || "Field"} must be a future date`
                );
            } else if (field.type === "time") {
              schema[field.id] = Yup.string()
                .notRequired()
                .nullable()
                .test(
                  "is-future-time",
                  `${field.label || "Field"} must be a future time`,
                  (value) => {
                    const now = new Date();
                    const selectedTime = new Date(`1970-01-01T${value}`);
                    return selectedTime > now;
                  }
                );
            } else if (field.type === "file") {
              schema[field.id] = Yup.mixed()
                .nullable()
                .notRequired()
                .test("fileType", "Unsupported File Format", (value) =>
                  value
                    ? ["image/png", "image/jpeg"].includes(value.type)
                    : false
                )
                .test("fileSize", "File is too large", (value) =>
                  value ? value.size <= 2000000 : false
                );
            } else if (field.type === "checkbox") {
              schema[field.id] = Yup.string().notRequired().nullable();
              field?.options?.forEach((option) => {
                schema[`${field.id}_options_${option?.id}`] =
                  Yup.string().required("Option label is required");
              });
            } else if (field.type === "radio") {
              schema[field.id] = Yup.string().notRequired().nullable();
              field?.options?.forEach((option) => {
                schema[`${field.id}_options_${option?.id}`] =
                  Yup.string().required("Option label is required");
              });
            }
            if (field.type === "select") {
              schema[field.id] = Yup.string().notRequired().nullable();
            }
          }

          return schema;
        }, {})
      )
    );
  }, [formFields]);
  const {
    handleSubmit,
    unregister,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  console.log("errors", errors);
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
            setValue(id, file);
            trigger(id);
            setFormFields(updatedFields);
          };
        } else {
          field.value = value;
          setValue(id, value);
          trigger(id);
        }
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
  const handleAddField = () => {
    const newFields = [...formFields];
    newFields.push({
      id: uuidv4(),
      label: "",
      labelId: uuidv4(),
      type: selectedType,
      value: "",
      options: [],
      required: false,
    });
    setFormFields(newFields);
  };

  const handleRemoveField = (id) => {
    const newFields = formFields.filter((field) => field.id !== id);
    unregister(id);
    trigger(id);
    setFormFields(newFields);
  };

  const handleOptionChangeForRadioAndCheckBoxes = (fieldId, optionId, type) => {
    const newFields = formFields.map((field) => {
      if (field.id === fieldId) {
        if (type === "radio") {
          field.options.forEach((option) => {
            option.selected = option.id === optionId;
          });
          setValue(fieldId, optionId);
          trigger(fieldId);
        } else if (type === "checkbox") {
          const optionIndex = field.options.findIndex(
            (option) => option.id === optionId
          );
          if (optionIndex !== -1) {
            field.options[optionIndex].selected =
              !field.options[optionIndex].selected;
          }

          setValue(fieldId, optionId);
          trigger(fieldId);
        }
      }
      return field;
    });
    setFormFields(newFields);
  };

  const handleOptionLabelChangeForRadioAndCheckBoxes = (
    fieldId,
    optionId,
    value,
    index
  ) => {
    const newFields = [...formFields];
    const fieldIndex = newFields.findIndex((f) => f.id === fieldId);
    const optionIndex = newFields[fieldIndex]?.options?.findIndex(
      (o) => o.id === optionId
    );
    if (fieldIndex !== -1 && optionIndex !== -1) {
      newFields[fieldIndex].options[optionIndex].label = value;
      setValue(`${fieldId}_options_${optionId}`, value);
      trigger(`${fieldId}_options_${optionId}`);
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
    unregister([fieldId, `${fieldId}_options_${optionId}`]);
    trigger([fieldId, `${fieldId}_options_${optionId}`]);
    setFormFields(newFields);
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
  };
  console.log("data3", watch());
  const handleRequiredChange = (id, event) => {
    const { checked } = event.target;
    const updatedFields = formFields?.map((field) =>
      field.id === id ? { ...field, required: checked } : field
    );
    setFormFields(updatedFields);
    setTimeout(() => {
      trigger(id);
    }, 100);
  };
  return (
    <div>
      <h2>Dynamic Form</h2>
      <label>
        Add Field Type:
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="textarea">TextArea</option>
          <option value="radio">Radio</option>
          <option value="checkbox">Checkbox</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="file">Files</option>
          <option value="select">Select</option>
        </select>
      </label>
      <button onClick={handleAddField}>Add Field</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        {formFields?.map((field, index) => {
          if (field?.value?.size > 0 && field.type == "file") {
            let extension = field?.value?.content?.split(":")[1]?.split(";")[0];
            var blob = base64ToBlob(
              field?.value?.content?.split(",")[1],
              extension
            );
            var file = new File([blob], field.value.name, {
              type: extension,
            });
          }
          return (
            <div
              key={field.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>
                Label:
                <span
                  style={{
                    color: field.required ? "red" : "gray",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRequiredChange(field.id, {
                      target: { checked: !field.required },
                    })
                  }
                  title={`Click to toggle ${
                    field.required ? "optional" : "required"
                  }`}
                >
                  *
                </span>
                <input
                  type="text"
                  onChange={(e) =>
                    handlelabelInputChange(field.id, field?.labelId, e)
                  }
                />
                {errors[`${field.id}_${field?.labelId}_label`] && (
                  <p style={{ color: "red" }}>
                    {errors[`${field.id}_${field?.labelId}_label`]?.message}
                  </p>
                )}
              </label>

              {field.type === "radio" && (
                <div>
                  Radio Options:
                  {field?.options?.map((option, index) => (
                    <div key={option.id}>
                      <input
                        type="radio"
                        name={`${field.id}`}
                        onChange={(e) =>
                          handleOptionChangeForRadioAndCheckBoxes(
                            field.id,
                            option.id,
                            field?.type
                          )
                        }
                        checked={option?.selected}
                      />
                      <input
                        type="text"
                        onChange={(e) =>
                          handleOptionLabelChangeForRadioAndCheckBoxes(
                            field.id,
                            option.id,
                            e.target.value,
                            index
                          )
                        }
                      />
                      {errors[`${field.id}_options_${option?.id}`] && (
                        <p style={{ color: "red" }}>
                          {errors[`${field.id}_options_${option?.id}`]?.message}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCheckboxAndRadioOption(
                            field.id,
                            option.id,
                            field?.type
                          )
                        }
                      >
                        Remove Option
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      handleAddOption(field);
                    }}
                  >
                    Add Option
                  </button>
                </div>
              )}
              {field?.type == "checkbox" && (
                <>
                  {field?.options?.map((option) => (
                    <div key={option.id}>
                      <input
                        type="checkbox"
                        checked={option?.selected}
                        onChange={() => {
                          handleOptionChangeForRadioAndCheckBoxes(
                            field.id,
                            option.id,
                            field?.type
                          );
                        }}
                      />
                      <input
                        type="text"
                        onChange={(e) =>
                          handleOptionLabelChangeForRadioAndCheckBoxes(
                            field.id,
                            option.id,
                            e.target.value,
                            index
                          )
                        }
                      />
                      {errors[`${field.id}_options_${option?.id}`] && (
                        <p style={{ color: "red" }}>
                          {errors[`${field.id}_options_${option?.id}`]?.message}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCheckboxAndRadioOption(
                            field.id,
                            option.id,
                            field?.type
                          )
                        }
                      >
                        Remove Option
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      handleAddOption(field);
                    }}
                  >
                    Add Option
                  </button>
                </>
              )}

              {(field.type == "text" ||
                field.type == "date" ||
                field.type == "time") && (
                <>
                  <label>
                    Value:
                    <input
                      type={field.type}
                      onChange={(e) => handleInputChange(field.id, e)}
                    />
                  </label>
                </>
              )}
              {field?.type == "file" && (
                <>
                  {" "}
                  <label>
                    Value:
                    <input
                      type={field.type}
                      onChange={(e) => handleInputChange(field.id, e)}
                    />
                  </label>
                  {field?.value?.content ? (
                    <a href={URL.createObjectURL(file)} download={file?.name}>
                      the uploaded file is :{file?.name}
                    </a>
                  ) : (
                    ""
                  )}
                </>
              )}
              {field?.type == "select" && (
                <>
                  <DynamicSelectInput
                    options={field?.options}
                    fieldId={field?.id}
                    setFormFields={setFormFields}
                    formFields={formFields}
                    handleInputChange={handleInputChange}
                  />
                </>
              )}
              {field?.type == "textarea" && (
                <>
                  <label>
                    Value:
                    <textarea
                      type={field.type}
                      onChange={(e) => handleInputChange(field.id, e)}
                    ></textarea>
                  </label>
                </>
              )}
              {errors[field.id] && (
                <p style={{ color: "red" }}>{errors[field.id]?.message}</p>
              )}
              <button type="button" onClick={() => handleRemoveField(field.id)}>
                Remove
              </button>

              <hr />
            </div>
          );
        })}
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default AdminDynamicForm ;
