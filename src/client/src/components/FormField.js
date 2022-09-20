import { Field, ErrorMessage } from 'formik';
import clsx from 'clsx';

/** A `<Field />` from Formik with error messages & basic styling. */
function FormField({ name, type, label, errors, placeholder, style }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <Field
          name={name}
          type={type || 'text'}
          placeholder={placeholder}
          placeholdertextcolor={'red'}
          style={style}
        />
      </div>
      <p className="help is-danger">
        <ErrorMessage name={name} />
      </p>
    </div>
  );
}

// className={clsx('input', errors[name] && 'is-danger')}

export default FormField;
