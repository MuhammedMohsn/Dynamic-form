import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const DynamicSelectInput = ({
  options,
  fieldId,
  setFormFields,
  formFields,
  handleInputChange,
}) => {
  let [newOption, setNewOption] = useState("");
  let handleInputChangeForOption = (e) => {
    setNewOption(e?.target?.value);
  };
  const handleAdd = () => {
    let copiedFormData = [...formFields];
    let selectedField = copiedFormData?.find((field) => {
      return field?.id == fieldId;
    });
    selectedField?.options?.push({ id: uuidv4(), name: newOption });

    setFormFields(
      copiedFormData?.map((item) => {
        if (item?.id == selectedField?.id) {
          return selectedField;
        } else {
          return item;
        }
      })
    );

    setNewOption("");
  };
  let handleDeleteOption = (fieldId, optionId) => {
    let copiedFormData = [...formFields];
    setFormFields(
      copiedFormData?.map((field) => {
        if (field?.id == fieldId) {
          return {
            ...field,
            options: field?.options?.filter((option) => {
              return option?.id !== optionId;
            }),
          };
        } else {
          return field;
        }
      })
    );
  };

  return (
    <div>
      <label htmlFor="newOptionInput">Enter Option:</label>
      <input
        type="text"
        id="newOptionInput"
        value={newOption}
        onChange={handleInputChangeForOption}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        Add Option
      </button>
      <br />
      <br />
      <select
        onChange={(e) => {
          handleInputChange(fieldId, e);
        }}
      >
        <option value={""}>Select an option...</option>
        {options?.map((option) => (
          <option key={option?.id} value={option?.id}>
            {option?.name}
          </option>
        ))}
      </select>
      <br />
      <br />

      <ul>
        {options.map((option, index) => (
          <li key={option?.id + "" + index}>
            {option.name}
            <button
              type="button"
              onClick={() => handleDeleteOption(fieldId, option.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DynamicSelectInput;
