import React from 'react';
import { useSelector } from "react-redux";
import { ARRAY_EXAMPLE_FORM_ROOT, selectFormState } from "./form/formReducer";
import styles from "./App.module.scss"
import { FormView } from "./form/components/FormView";
import { ToggleFormButton } from "./form/components/Button";
import { Tabs } from "./form/components/Tabs";

function App() {
  const formState = useSelector(selectFormState)

  return (
    <div className={styles.app}>
      {formState[ARRAY_EXAMPLE_FORM_ROOT]
        ? <div className={styles.main}>
          <Tabs viewTab={formState[ARRAY_EXAMPLE_FORM_ROOT].viewTab} />
          <FormView {...formState[ARRAY_EXAMPLE_FORM_ROOT]} />
        </div>
        : <ToggleFormButton />
      }
    </div>
  );
}

export default App;
