import React, { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";

function FileUploadInput({
  field,
  errors,
  handleRequiredChange,
  handleRemoveField,
  handleInputChange,
  handlelabelInputChange,
  handleDeleteFileForField,
  userType,
}) {
  let [isShowDelete, setIsShowDelete] = useState(false);
  const iconMap = {
    file: <FaFileUpload className="mx-2 fs-4" />,
  };
  let inputFileRef = useRef();
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
              <div
                className="cursor-pointer file-upload-container d-flex flex-column align-items-center justify-content-center mx-auto p-4"
                onClick={() => {
                  inputFileRef?.current?.click();
                }}
              >
                <FaFileUpload className="text-muted fs-3" />
                <span className="text-muted fs-4"> Click to upload</span>
                <span className="text-muted fs-6">max 10G</span>
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
              {Array.isArray(field?.value) &&
                field?.value?.map((file) => {
                  return (
                    <div
                      key={file?.id}
                      className="attachment-container mx-auto px-3 d-flex align-items-center justify-content-between my-3 bg-success-light"
                    >
                      <div className="attachment-name-container w-50">
                        <span>{file?.name}</span>
                        <span className="mx-2">{file?.size}</span>
                      </div>
                      <div className="attachment-actions d-flex align-items-center w-25 justify-content-end">
                        <MdDelete
                          className="text-danger cursor-pointer fs-4 mx-4"
                          onClick={() => {
                            handleDeleteFileForField(field?.id, file?.id);
                          }}
                        />
                        <a
                          href={
                            file?.fileAsBinary
                              ? URL.createObjectURL(file?.fileAsBinary)
                              : ""
                          }
                          download={file?.name}
                        >
                          <FaDownload className="text-primary cursor-pointer fs-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default FileUploadInput;
