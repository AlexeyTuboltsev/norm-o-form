import React from 'react';
import { ToggleFormButton } from "./form/Button";
import { useSelector } from "react-redux";
import { ONE_OF_EXAMPLE_FORM_ROOT, selectFormState } from "./form/formReducer";
import { OneOfExampleForm } from "./form/OneOfExampleForm";
import styles from "./App.module.scss"

function App() {
  const formState = useSelector(selectFormState)
  return (
    <div className={styles.App}>

      {!formState[ONE_OF_EXAMPLE_FORM_ROOT] && <ToggleFormButton />}
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
