import React, { Fragment, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaDotCircle, FaCheckSquare } from "react-icons/fa";
function RadioCheckboxInput({
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
}) {
  let [isShowDelete, setIsShowDelete] = useState(false);
  const iconMap = {
    radio: <FaDotCircle className="mx-2 fs-4" />,
    checkbox: <FaCheckSquare className="mx-2 fs-4" />,
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
                className="form-control w-50"
              />
              <br />
              {errors[`${field.id}_${field?.labelId}_label`] && (
                <p style={{ color: "red" }}>
                  {errors[`${field.id}_${field?.labelId}_label`]?.message}
                </p>
              )}
            </div>
          </>
        )}
        {field?.label && (
          <>
            <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
              {" "}
              <div className="d-flex">
                {" "}
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
              {field?.options?.map((option) => {
                return (
                  <Fragment key={option.id}>
                    {" "}
                    <div className="d-flex align-items-center my-2">
                      {" "}
                      <input
                        type={field?.type}
                        name={`${field?.type}_${field.id}`}
                        id={field?.id}
                        readOnly={userType == "admin" ? true : false}
                        disabled={userType == "admin" ? true : false}
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
                        value={option?.label}
                        onChange={(e) =>
                          handleOptionLabelChangeForRadioAndCheckBoxes(
                            field.id,
                            option.id,
                            e.target.value
                          )
                        }
                        id={option?.id}
                        className="form-control mx-2 "
                        placeholder="option label"
                        readOnly={userType == "user" ? true : false}
                        disabled={userType == "user" ? true : false}
                      />
                      {userType == "admin" && (
                        <>
                          <MdDelete
                            className="text-danger cursor-pointer fs-4"
                            onClick={() => {
                              handleRemoveCheckboxAndRadioOption(
                                field.id,
                                option.id,
                                field?.type
                              );
                            }}
                          />
                        </>
                      )}
                      <br />
                    </div>
                    {userType == "admin" && (
                      <>
                        {" "}
                        {errors[`${field.id}_options_${option.id}_label`] && (
                          <p style={{ color: "red" }}>
                            {
                              errors[`${field.id}_options_${option.id}_label`]
                                ?.message
                            }
                          </p>
                        )}
                      </>
                    )}
                  </Fragment>
                );
              })}
              {userType == "admin" && (
                <>
                  {" "}
                  {errors[`${field.id}_options_count`] && (
                    <p style={{ color: "red" }}>
                      {errors[`${field.id}_options_count`]?.message}
                    </p>
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
              {userType == "admin" && (
                <>
                  {" "}
                  <div className="d-flex align-items-center justify-content-center w-100 my-3">
                    <button
                      type="button"
                      className="border-0 outline-none bg-primary w-25 btn-md p-2"
                      onClick={() => {
                        handleAddOption(field);
                      }}
                    >
                      + Add Option
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RadioCheckboxInput;
