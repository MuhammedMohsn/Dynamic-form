import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
function TextAreaInput({
  field,
  errors,
  handleRequiredChange,
  handleRemoveField,
  handleInputChange,
  handlelabelInputChange,
  handleInputDescriptionChange,
  readOnly,
  userType,
}) {
  let [isShowDelete, setIsShowDelete] = useState(false);
  const iconMap = {
    textarea: <FaListUl className="mx-2 fs-4" />,
  };
  return (
    <>
      <div
        className="p-4 border border-2 rounded bg-white mt-3 h-fit"
        onMouseEnter={() => {
          setIsShowDelete(true);
        }}
        onMouseLeave={() => {
          setIsShowDelete(false);
        }}
      >
        {userType == "admin" && (
          <>
            {" "}
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex">
                {iconMap[field?.type]}
                <div>{field?.type}</div>
              </div>
              {isShowDelete && (
                <MdDelete
                  className="text-danger cursor-pointer fs-4"
                  onClick={() => {
                    handleRemoveField(field.id);
                  }}
                />
              )}
            </div>
          </>
        )}

        {userType == "admin" && (
          <>
            <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
              {" "}
              <div className="d-flex align-items-center">
                <label htmlFor={field?.labelId} className="fs-3">
                  Field label
                </label>
                <span
                  className="mx-2"
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
              </div>
              <br />
              <input
                type="text"
                onChange={(e) =>
                  handlelabelInputChange(field.id, field?.labelId, e)
                }
                value={field?.label}
                id={field?.labelId}
                name={`label_${field?.labelId}`}
                className="form-control w-25"
              />
              <br />
              {errors[`${field.id}_${field?.labelId}_label`] && (
                <p style={{ color: "red" }}>
                  {errors[`${field.id}_${field?.labelId}_label`]?.message}
                </p>
              )}
              <div className="d-flex align-items-center">
                <FaRegQuestionCircle className="fs-4" />
                <span className="mx-2">Help text</span>
              </div>
              <textarea
                name={`${field?.type}_${field?.id}_description`}
                id={field?.id + "description"}
                onChange={(e) =>
                  handleInputDescriptionChange(field.id, e?.target?.value)
                }
                value={field?.description}
                placeholder={`Add clarification instructions for input`}
                className="form-control w-100 my-2"
                rows={5}
              ></textarea>
              <span className="text-muted">
                This text will appear below the field to help users understand
                what to enter.
              </span>
            </div>
          </>
        )}
        {field?.label && (
          <>
            <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
              {" "}
              <div className="d-flex">
                <h3>{field?.label}</h3>
                <span
                  className="mx-2"
                  style={{
                    color: field.required ? "red" : "gray",
                    fontWeight: "bold",
                  }}
                >
                  *
                </span>
              </div>
              <br />
              <textarea
                type={field?.type}
                name={`${field?.type}_${field?.id}`}
                id={field?.id}
                onChange={(e) => handleInputChange(field.id, e)}
                value={field?.value}
                placeholder={`Enter ${field?.label}`}
                className="form-control w-100"
                readOnly={userType == "admin" ? true : false}
                disabled={userType == "admin" ? true : false}
                rows={5}
              ></textarea>
              <br />
              {userType == "admin" && (
                <>
                  {errors[field.id] && (
                    <p style={{ color: "red" }}>{errors[field.id]?.message}</p>
                  )}
                </>
              )}
              {userType == "user" && (
                <>
                  {errors[`${field.id}_value`] && (
                    <p style={{ color: "red" }}>
                      {errors[`${field.id}_value`]?.message}
                    </p>
                  )}
                </>
              )}
              {userType == "user" && (
                <>
                  {field?.description && (
                    <span className="text-muted">{field?.description}</span>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default TextAreaInput;
