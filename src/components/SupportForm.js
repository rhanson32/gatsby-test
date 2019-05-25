import React from 'react'
import { Field, reduxForm } from 'redux-form'

const validate = values => {
  const errors = {}
  if (!values.headline) {
    errors.headline = 'Required'
  }
  if (!values.description) {
    errors.description = 'Required'
  } 
  
  return errors
}


const SupportForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form className="support-form" onSubmit={handleSubmit}>
        <div className="support-form-title">
            Submit a Support Request
        </div>
      <div className="form-headline">
        <label>Headline</label>
        <div className="form-input">
          <Field
            name="headline"
            component="input"
            type="text"
            placeholder="Brief summary of the issue"
            
          />
        </div>
      </div>
      <div className="form-description">
        <label>Description</label>
        <div className="support-textarea">
          <Field className="form-textarea" name="description" component="textarea" placeholder="Detailed account of the issue" />
        </div>
      </div>
      <div className="support-form-buttons">
        <button className="remove-button" type="button" disabled={pristine || submitting} onClick={reset}>
          Clear Values
        </button>
        <button className="add-button" type="submit" disabled={pristine || submitting}>
          Submit
        </button>
        
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'support', // a unique identifier for this form
  validate
})(SupportForm)
