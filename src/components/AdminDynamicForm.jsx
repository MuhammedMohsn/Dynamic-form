import SelectInputSection from "./SelectInputSection";
import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import FormInputsSection from "./FormInputsSection";
import { useLocation } from "react-router-dom";
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
          if (field.label == "") {
            schema[`${field.id}_${field.labelId}_label`] = Yup.string()
              .required("Field is required")
              .max(50, "Field cannot exceed 50 characters");
          } else {
            schema[`${field.id}_${field.labelId}_label`] = Yup.string()
              .notRequired()
              .optional()
              .nullable();
          }
          schema[`${field.id}`] = Yup.string()
            .notRequired()
            .optional()
            .nullable();
          if (["text"].includes(field.type)) {
            schema[`${field.id}_value`] = Yup.string()
              .nullable()
              .notRequired()
              .optional();
            // .max(50, "Field cannot exceed 50 characters");
          }
          if (["date", "time"].includes(field.type)) {
            schema[`${field.id}_value`] = Yup.string()
              .nullable()
              .notRequired()
              .optional();
          }
          if (["select", "checkbox", "radio"].includes(field.type)) {
            if (field.options.length < 2) {
              schema[`${field.id}_options_count`] = Yup.number()
                .required("You must add more than one option")
                .min(2, "You must add more than one option");
            } else {
              schema[`${field.id}_options_count`] = Yup.number()
                .notRequired()
                .optional()
                .nullable();
            }
            field.options?.forEach((option) => {
              if (option.label == "") {
                schema[`${field.id}_options_${option.id}_label`] =
                  Yup.string().required("Option label is required");
              } else {
                schema[`${field.id}_options_${option.id}_label`] = Yup.string()
                  .notRequired()
                  .optional()
                  .nullable();
              }
            });
          }
          return schema;
        }, {})
      )
    );
  }, [formFields]);
  useEffect(() => {
    if (JSON.stringify({}) != JSON.stringify(validationSchema)) {
      trigger();
    }
  }, [validationSchema]);
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
  let [userType, setUserType] = useState("admin");
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
            watch,
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
            userType
          }}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminDynamicForm;
