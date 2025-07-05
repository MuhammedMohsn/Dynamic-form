import React, { Fragment, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import Select from "react-select";
import { FaRegQuestionCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function FileUploadInput({
  field,
  errors,
  handleRequiredChange,
  handleRemoveField,
  handleInputChange,
  handlelabelInputChange,
  handleDeleteFileForField,
  userType,
  handleAllowedExtensionsForFiles,
  handleMaxAllowedSizeForFiles,
  handleInputDescriptionChange,
  handleReorderFiles,
}) {
  let [isShowDelete, setIsShowDelete] = useState(false);
  const iconMap = {
    file: <FaFileUpload className="mx-2 fs-4" />,
  };
  let inputFileRef = useRef();
  const fileExtensionOptions = [
    { value: "pdf", label: "PDF (.pdf)" },
    { value: "doc", label: "Word Document (.doc)" },
    { value: "docx", label: "Word Document (.docx)" },
    { value: "xls", label: "Excel Spreadsheet (.xls)" },
    { value: "xlsx", label: "Excel Spreadsheet (.xlsx)" },
    { value: "ppt", label: "PowerPoint (.ppt)" },
    { value: "pptx", label: "PowerPoint (.pptx)" },
    { value: "jpg", label: "JPEG Image (.jpg)" },
    { value: "jpeg", label: "JPEG Image (.jpeg)" },
    { value: "png", label: "PNG Image (.png)" },
    { value: "gif", label: "GIF Image (.gif)" },
    { value: "txt", label: "Text File (.txt)" },
    { value: "csv", label: "CSV File (.csv)" },
    { value: "zip", label: "ZIP Archive (.zip)" },
    { value: "rar", label: "RAR Archive (.rar)" },
    { value: "mp3", label: "MP3 Audio (.mp3)" },
    { value: "mp4", label: "MP4 Video (.mp4)" },
  ];
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(
      field.value,
      result.source.index,
      result.destination.index
    );
    handleReorderFiles(field.id, reordered);
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
            {" "}
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
              <div className="d-flex justify-content-between align-items-center">
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
                {userType == "admin" && (
                  <>
                    <div className="d-flex w-40 justify-content-between align-items-center row">
                      {" "}
                      <div className="col-lg-6 col-sm-12">
                        <label htmlFor={`${field?.id}_allowed_extension`}>
                          Choose allowed extensions :
                        </label>
                        <Select
                          className="my-1"
                          options={fileExtensionOptions}
                          onChange={(selected) => {
                            handleAllowedExtensionsForFiles(
                              field?.id,
                              selected
                            );
                          }}
                          placeholder="Select option"
                          isClearable={true}
                          isMulti
                          id={`${field?.id}_allowed_extension`}
                        />
                      </div>
                      <div className="col-lg-6 col-sm-12">
                        <label htmlFor={`${field?.id}_allowed_extension`}>
                          Max size for files in GB :
                        </label>
                        <br />
                        <input
                          type="number"
                          onChange={(e) =>
                            handleMaxAllowedSizeForFiles(
                              field?.id,
                              e?.target?.value
                            )
                          }
                          value={field?.maxAllowedSize}
                          id={`${field?.id}_allowed_max_size`}
                          name={`${field?.id}_allowed_max_size`}
                          className="form-control w-100 my-1"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <br />
              <div
                className="cursor-pointer file-upload-container d-flex flex-column align-items-center justify-content-center mx-auto p-4"
                onClick={() => {
                  inputFileRef?.current?.click();
                }}
              >
                <FaFileUpload className="text-muted fs-3" />
                <span className="text-muted fs-4"> Click to upload</span>
                {field?.allowedExtensions?.length > 0 && (
                  <>
                    <span className="text-muted fs-6">
                      allowed extensions are{" "}
                      {field?.allowedExtensions
                        ?.map((extension) => {
                          return `.${extension?.value}`;
                        })
                        ?.join("-")}
                    </span>
                  </>
                )}
                {field?.maxAllowedSize > 0 && (
                  <span className="text-muted fs-6">
                    max {field?.maxAllowedSize} GB
                  </span>
                )}
              </div>
              <input
                type={field?.type}
                ref={inputFileRef}
                className="d-none"
                name={`${field?.type}_${field?.id}`}
                id={field?.id}
                onChange={(e) => handleInputChange(field.id, e)}
                multiple
                readOnly={userType == "admin" ? true : false}
                disabled={userType == "admin" ? true : false}
              />
              <br />
              {userType == "admin" ? (
                <>
                  {errors[field.id] && (
                    <p style={{ color: "red" }}>{errors[field.id]?.message}</p>
                  )}
                </>
              ) : (
                <></>
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`files-droppable-${field.id}`}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {Array.isArray(field?.value) &&
                        field?.value?.map((file, index) => (
                          <Draggable
                            draggableId={file.id.toString()}
                            index={index}
                            key={file.id}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="attachment-container mx-auto px-3 d-flex align-items-center justify-content-between my-3 bg-success-light">
                                  <div className="attachment-name-container w-50">
                                    <span>{file?.name}</span>
                                    <span className="mx-2">{file?.size}</span>
                                  </div>
                                  <div className="attachment-actions d-flex align-items-center w-25 justify-content-end">
                                    <MdDelete
                                      className="text-danger cursor-pointer fs-4 mx-4"
                                      onClick={() =>
                                        handleDeleteFileForField(
                                          field?.id,
                                          file?.id
                                        )
                                      }
                                    />
                                    <a
                                      href={
                                        file?.fileAsBinary
                                          ? URL.createObjectURL(
                                              file?.fileAsBinary
                                            )
                                          : ""
                                      }
                                      download={file?.name}
                                    >
                                      <FaDownload className="text-primary cursor-pointer fs-4" />
                                    </a>
                                  </div>
                                </div>
                                {errors[
                                  `${field.id}_${file?.id}_file_type`
                                ] && (
                                  <p
                                    style={{ color: "red" }}
                                    className="mx-auto w-85"
                                  >
                                    {
                                      errors[
                                        `${field.id}_${file?.id}_file_type`
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

export default FileUploadInput;
