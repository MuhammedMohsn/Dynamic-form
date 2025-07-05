import React, { Fragment, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaDotCircle, FaCheckSquare } from "react-icons/fa";
import { FaRegQuestionCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  handleInputDescriptionChange,
  handleReorderOptionsForRadioAndCheckboxesAndSelect,
  userType,
}) {
  let [isShowDelete, setIsShowDelete] = useState(false);
  const iconMap = {
    radio: <FaDotCircle className="mx-2 fs-4" />,
    checkbox: <FaCheckSquare className="mx-2 fs-4" />,
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(
      field.options,
      result.source.index,
      result.destination.index
    );
    handleReorderOptionsForRadioAndCheckboxesAndSelect(field.id, reordered);
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
              {userType === "admin" ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId={`droppable-options-${field.id}`}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {field?.options?.map((option, index) => (
                          <Draggable
                            draggableId={option.id.toString()}
                            index={index}
                            key={option.id}
                          >
                            {(provided) => (
                              <div
                                className="my-2"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="d-flex align-items-center my-2">
                                  {" "}
                                  <input
                                    type={field?.type}
                                    name={`${field?.type}_${field.id}`}
                                    id={field?.id}
                                    readOnly
                                    disabled
                                    onChange={() =>
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
                                    className="form-control mx-2"
                                    placeholder="option label"
                                  />
                                  <MdDelete
                                    className="text-danger cursor-pointer fs-4"
                                    onClick={() =>
                                      handleRemoveCheckboxAndRadioOption(
                                        field.id,
                                        option.id,
                                        field?.type
                                      )
                                    }
                                  />
                                </div>

                                {errors[
                                  `${field.id}_options_${option.id}_label`
                                ] && (
                                  <p style={{ color: "red" }}>
                                    {
                                      errors[
                                        `${field.id}_options_${option.id}_label`
                                      ]?.message
                                    }
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                field.options.map((option) => (
                  <div
                    className="d-flex align-items-center my-2"
                    key={option.id}
                  >
                    <input
                      type={field?.type}
                      name={`${field?.type}_${field.id}`}
                      id={field?.id}
                      readOnly
                      disabled
                      onChange={() =>
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
                      readOnly
                      disabled
                      className="form-control mx-2"
                      placeholder="option label"
                    />
                  </div>
                ))
              )}
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

export default RadioCheckboxInput;
