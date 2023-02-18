import React from 'react';
import './App.css';
import { ToggleFormButton } from "./form/Button";
import { useSelector } from "react-redux";
import { ONE_OF_EXAMPLE_FORM_ROOT, selectFormState } from "./form/formReducer";
import { OneOfExampleForm } from "./form/OneOfExampleForm";

function App() {
  const formState = useSelector(selectFormState)
  return (
    <div className="App">

      <ToggleFormButton />
      {formState[ONE_OF_EXAMPLE_FORM_ROOT]
        ? <OneOfExampleForm
            formId={ONE_OF_EXAMPLE_FORM_ROOT}
            formData={formState[ONE_OF_EXAMPLE_FORM_ROOT]}
          />
        : null
      }
    </div>
  );
}

export default App;
