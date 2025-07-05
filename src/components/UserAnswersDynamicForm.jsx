import { ToastContainer } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import FormInputsSection from "./FormInputsSection";
const UserAnswersDynamicForm = ({ formFields, setFormFields }) => {
  let [validationSchema, setValidationSchema] = useState({});
  useEffect(() => {
    setValidationSchema(
      Yup.object().shape(
        formFields.reduce((schema, field) => {
          if (["text"].includes(field.type)) {
            if (field.required && field.value == "") {
              schema[`${field.id}_value`] = Yup.string()
                .required("Input field is required")
                .max(50, "Field cannot exceed 50 characters");
            } else {
              schema[`${field.id}_value`] = Yup.string()
                .nullable()
                .notRequired()
                .optional()
                .max(50, "Field cannot exceed 50 characters");
            }
          }
          if (
            [
              "date",
              "time",
              "radio",
              "checkbox",
              "textarea",
              "editor",
            ].includes(field.type)
          ) {
            if (field?.required && field.value == "") {
              schema[`${field.id}_value`] = Yup.string().required(
                "Input field is required"
              );
            } else {
              schema[`${field.id}_value`] = Yup.string()
                .nullable()
                .notRequired()
                .optional();
            }
          }
          if (["select"].includes(field.type)) {
            if (field?.required) {
              if (field?.value == "" || field?.value?.length == 0) {
                schema[`${field.id}_value`] = Yup.string().required(
                  "Input field is required"
                );
              }
            } else {
              schema[`${field.id}_value`] = Yup.string()
                .nullable()
                .notRequired()
                .optional();
            }
          }
          if (["file"].includes(field.type)) {
            if (field?.value?.length == 0 && field?.required) {
              schema[`${field.id}_value`] = Yup.string().required(
                "Input field is required"
              );
            } else {
              schema[`${field.id}_value`] = Yup.string()
                .nullable()
                .notRequired()
                .optional();
            }
            let maxSize = +field?.maxAllowedSize * 1024 * 1024;
            let allowedExtensions =
              Array.isArray(field?.allowedExtensions) &&
              field?.allowedExtensions?.map((extension) => {
                return extension?.value;
              });
            let fileInputsSize =
              Array.isArray(field?.value) &&
              field?.value
                ?.map((file) => {
                  return file?.fileAsBinary?.size;
                })
                ?.reduce((acc, size) => {
                  return acc + size;
                }, 0);
            if (fileInputsSize > maxSize) {
              schema[`${field.id}_value`] = Yup.string().required(
                "You are exceed max size"
              );
            }
            Array.isArray(field?.value) &&
              field?.value?.forEach((file) => {
                if (
                  !allowedExtensions?.includes(
                    file?.fileAsBinary.name?.split(".")?.slice(-1)[0]
                  )
                ) {
                  schema[`${field.id}_${file?.id}_file_type`] =
                    Yup.string().required("file extension not allowed");
                } else {
                  schema[`${field.id}_${file?.id}_file_type`] = Yup.string()
                    .optional()
                    .notRequired()
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
  let [userType, setUserType] = useState("user");
  return (
    <>
      <div className="container">
        {" "}
        <h1 className="d-flex align-items-center justify-content-center text-primary mt-4">
          Please answer the following questions
        </h1>
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
            userType,
          }}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default UserAnswersDynamicForm;
