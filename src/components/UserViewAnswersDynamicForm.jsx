import ViewDynamicForm from "./ViewDynamicForm";
const UserViewAnswersDynamicForm = ({ formFields }) => {
  return (
    <>
      <div className="container">
        {" "}
        <h1 className="d-flex align-items-center justify-content-center text-primary mt-4">
          the questions with its answers
        </h1>
        <ViewDynamicForm
          {...{
            formFields,
          }}
        />
      </div>
    </>
  );
};

export default UserViewAnswersDynamicForm;
