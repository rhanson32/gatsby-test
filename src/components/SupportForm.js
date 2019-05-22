import React from 'react'
import { Field, reduxForm } from 'redux-form'

const SupportForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form className="support-form" onSubmit={handleSubmit}>
        <div className="support-form-title">
            Submit a support request
        </div>
      <div className="form-headline">
        <label>Headline</label>
        <div className="form-input">
          <Field
            name="headline"
            component="input"
            type="text"
            placeholder="Headline"
            
          />
        </div>
      </div>
      <div className="form-description">
        <label>Description</label>
        <div className="support-textarea">
          <Field className="form-textarea" name="description" component="textarea" />
        </div>
      </div>
      <div>
        <button className="add-button" type="submit" disabled={pristine || submitting}>
          Submit
        </button>
        <button className="remove-button" type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'support' // a unique identifier for this form
})(SupportForm)
