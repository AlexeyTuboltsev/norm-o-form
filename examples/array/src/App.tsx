import React from 'react';
import { ToggleFormButton } from "./form/components/Button";
import { useSelector } from "react-redux";
import { ARRAY_EXAMPLE_FORM_ROOT, selectFormState } from "./form/formReducer";
import { ArrayExampleForm } from "./form/ArrayExampleForm";
import styles from "./App.module.scss"

function App() {
  const formState = useSelector(selectFormState)
  return (
    <div className={styles.App}>

      {!formState[ARRAY_EXAMPLE_FORM_ROOT] && <ToggleFormButton />}
      {formState[ARRAY_EXAMPLE_FORM_ROOT]
        ? <ArrayExampleForm
            formId={ARRAY_EXAMPLE_FORM_ROOT}
            formData={formState[ARRAY_EXAMPLE_FORM_ROOT]}
          />
        : null
      }
    </div>
  );
}

export default App;
