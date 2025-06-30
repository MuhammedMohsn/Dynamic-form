import SelectInputSection from "./SelectInputSection";
import FormInputsSection from "./FormInputsSection";
import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useEffect } from "react";
const AdminDynamicForm = ({
  selectedType,
  setSelectedType,
  formFields,
  setFormFields,
}) => {
  let [validationSchema, setValidationSchema] = useState({});
  useEffect(() => {
    setValidationSchema(
      Yup.object().shape(
        formFields.reduce((schema, field) => {
          schema[`${field.id}_${field.labelId}`] = Yup.string()
            .notRequired()
            .optional()
            .nullable();
          schema[`${field.id}_${field.labelId}_label`] = Yup.string()
            .required("Field is required")
            .max(50, "Field cannot exceed 50 characters");
          schema[`${field.id}`] = Yup.string()
            .notRequired()
            .optional()
            .nullable();
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
            console.log("length",field.options.length)
            if (field.options.length < 2) {
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
  // console.log("schema",validationSchema)
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
          {...{
            selectedType,
            setFormFields,
            formFields,
            setSelectedType,
            setValue,
            trigger,
            watch
          }}
        />
        <FormInputsSection
          {...{
            setFormFields,
            formFields,
            handleSubmit,
            watch,
            unregister,
            setValue,
            trigger,
            errors,
          }}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminDynamicForm;
