import React, { Fragment, useState } from "react";
import { MdDelete } from "react-icons/md";
import Select from "react-select";
import { FaCaretDown } from "react-icons/fa";
function SelectInput({
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
  readOnly
}) {
  let [isShowDelete, setIsShowDelete] = useState(false);
  const iconMap = {
    select: <FaCaretDown className="mx-2 fs-4" />,
  };
  const selectOptions = field?.options?.map((option) => ({
    value: option?.id,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{option?.label}</span>
      </div>
    ),
  }));
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
            className="form-control w-25"
          />
          <br />
          {errors[`${field.id}_${field?.labelId}_label`] && (
            <p style={{ color: "red" }}>
              {errors[`${field.id}_${field?.labelId}_label`]?.message}
            </p>
          )}
        </div>
        {field?.label && (
          <>
            <div className="p-4 border border-2 rounded bg-white mt-3 h-fit">
              {" "}
              <div className="d-flex align-items-center justify-content-between">
                <h3>{field?.label}</h3>
                <div className="w-35 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="mx-2">يمكنك اختيار اكثر من خيار</span>
                    <input
                      type="radio"
                      name={`${field.id}_isMulti`}
                      onChange={() => {
                        handleDetermineSelectionType(field, field?.isMulti);
                      }}
                      checked={field?.isMulti == true}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="mx-2">يمكنك اختيار خيار واحد</span>
                    <input
                      type="radio"
                      name={`${field.id}_isMulti`}
                      onChange={() => {
                        handleDetermineSelectionType(field, field?.isMulti);
                      }}
                      checked={field?.isMulti == false}
                    />
                  </div>
                </div>
              </div>
              <br />
              <Select
                className="my-3"
                options={selectOptions}
                // onChange={(option) => handleSelectChange(field?.id, option)}
                placeholder="Select option"
                // isDisabled={true}
                isClearable={true}
                isMulti={field?.isMulti}
                readOnly={readOnly}
                disabled={readOnly}
              />
              <br />
              {field?.options?.map((option, index) => {
                return (
                  <Fragment key={option.id}>
                    {" "}
                    <div className="d-flex align-items-center my-2">
                      {" "}
                      <input
                        type="text"
                        value={option?.value}
                        onChange={(e) =>
                          handleOptionLabelChangeForSelect(
                            field.id,
                            option.id,
                            e.target.value,
                            index
                          )
                        }
                        className="form-control mx-2 "
                        placeholder="option label"
                      />
                      <MdDelete
                        className="text-danger cursor-pointer fs-4"
                        onClick={() => {
                          handleRemoveSelectOption(field.id, option.id);
                        }}
                      />
                      <br />
                    </div>
                    {errors[`${field.id}_options_${option.id}_label`] && (
                      <p style={{ color: "red" }}>
                        {
                          errors[`${field.id}_options_${option.id}_label`]
                            ?.message
                        }
                      </p>
                    )}
                  </Fragment>
                );
              })}
              {errors[`${field.id}_options_count`] && (
                <p style={{ color: "red" }}>
                  {errors[`${field.id}_options_count`]?.message}
                </p>
              )}
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
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SelectInput;
