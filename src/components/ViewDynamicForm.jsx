import React, { Fragment } from "react";
import base64ToFile from "../functions/base64ToFile";
import Select from "react-select";

function ViewDynamicForm({ formFields }) {
  const renderField = (field) => {
    if (["text", "date", "time"].includes(field.type)) {
      return (
        <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
          <div>
            <label className="text-decoration-underline">{field?.label}</label>
            <span
              className="mx-2"
              style={{
                color: field.required ? "red" : "gray",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              *
            </span>
          </div>
          <p className="py-2">{field?.value}</p>
        </div>
      );
    } else if (["radio", "checkbox"].includes(field.type)) {
      return (
        <>
          <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
            <div className="d-flex align-items-center">
              <label className="text-decoration-underline">
                {field?.label}
              </label>
              <span
                className="mx-2"
                style={{
                  color: field.required ? "red" : "gray",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                *
              </span>
            </div>
            {field.options.map((option) => (
              <div className="d-flex align-items-center my-2" key={option.id}>
                <input
                  type={field?.type}
                  name={`${field?.type}_${field.id}`}
                  id={option?.id}
                  checked={option?.selected}
                  className="mx-2"
                />
                <p className="p-0 m-0">{option?.label}</p>
              </div>
            ))}
          </div>
        </>
      );
    } else if (field.type === "textarea") {
      return (
        <>
          <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
            <div>
              <label className="text-decoration-underline">
                {field?.label}
              </label>
              <span
                className="mx-2"
                style={{
                  color: field.required ? "red" : "gray",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                *
              </span>
            </div>
            <p className="py-2">{field?.value}</p>
          </div>
        </>
      );
    } else if (field.type === "file") {
      return (
        <>
          {" "}
          <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
            <div>
              <label className="text-decoration-underline">
                {field?.label}
              </label>
              <span
                className="mx-2"
                style={{
                  color: field.required ? "red" : "gray",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                *
              </span>
            </div>
            {field.value.map((file) => {
              return (
                <Fragment key={file?.id}>
                  <div className="d-flex align-items-center justify-content-between my-3 ">
                    <a
                      href={URL.createObjectURL(base64ToFile(file?.content))}
                      download={file?.name}
                    >
                      {file?.name}
                    </a>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </>
      );
    } else if (field.type === "select") {
      let allOptions = field?.options?.map((option) => {
        return {
          label: option?.label,
          value: option?.id,
        };
      });
      let selectedOption = field?.options?.filter((option) => {
        if (Array.isArray(field?.value)) {
          return field?.value?.includes(option?.id);
        } else {
          return field?.value == option?.id;
        }
      });
      return (
        <>
          <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
            <div>
              <label className="text-decoration-underline">
                {field?.label}
              </label>
              <span
                className="mx-2"
                style={{
                  color: field.required ? "red" : "gray",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                *
              </span>
            </div>
            <Select
              className="my-3"
              options={allOptions}
              placeholder="Select option"
              isDisabled
              value={selectedOption}
            />
          </div>
        </>
      );
    } else if (field.type === "editor") {
      return (
        <>
          <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
            <div>
              <label className="text-decoration-underline">
                {field?.label}
              </label>
              <span
                className="mx-2"
                style={{
                  color: field.required ? "red" : "gray",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                *
              </span>
            </div>
            <div
              className="py-2"
              dangerouslySetInnerHTML={{ __html: field?.value }}
            />
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
        {" "}
        {formFields?.map((field) => {
          return <Fragment key={field?.id}>{renderField(field)}</Fragment>;
        })}
      </div>
    </>
  );
}

export default ViewDynamicForm;
