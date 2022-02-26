import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { notification, Form, Button } from 'antd'
import useRequestHook from '../hooks/useRequestHook'
import { MatildaContext } from '../index'

export default function FormComponent (props) {
  const { path, layout, confirmLabel, confirmType, confirmBlock, successMessage, paramsDecorator, paramsValidator, onResponseSuccess, onResponseError, onResponse, formRef } = props
  const { getTranslation } = useContext(MatildaContext)
  const [antdForm] = Form.useForm()
  const request = useRequestHook()

  useEffect(() => {
    if (!formRef) return
    formRef.current = { antdForm }
  }, [formRef, antdForm])

  /**
   * @function onSuccess
   */
  const onSuccess = onResponseSuccess ? onResponseSuccess : (response) => {
    antdForm.resetFields()
    notification['success']({ message: getTranslation(successMessage) })
  }

  /**
   * @function onError
   */
  const onError = onResponseError ? onResponseError : (response) => {
    const fieldsKeys = Object.keys(antdForm.getFieldsValue())

    const errorsWithFields = response.errors.filter((e) => fieldsKeys.includes(e.code))
    const errorsWithoutFields = response.errors.filter(x => !errorsWithFields.includes(x))
    antdForm.setFields(errorsWithFields.map((err) => ({ name: err.code, errors: [err.message] })))

    if (errorsWithoutFields.length > 0) {
      notification['error']({ message: errorsWithoutFields[0].message })
    }
  }

  /**
   * @function onFinish
   * @param {*} formParams 
   */
  const onFinish = (formParams) => {
    const params = Object.assign({}, paramsDecorator(formParams))
    if(!paramsValidator(params)) return false

    request.send(path, params).then((response) => {
      if (!onResponse(response)) return

      if (response.result) {
        onSuccess(response)
      } else {
        onError(response)
      }
    })
  }

  return (
    <Form
      form={antdForm}
      layout={layout}
      onFinish={onFinish}
    >
      {props.children}

      <Form.Item style={{ textAlign: 'right', marginTop: 15 }}>
        <Button type={confirmType} block={confirmBlock} loading={request.loading} htmlType="submit">
          {getTranslation(confirmLabel)}
        </Button>
      </Form.Item>
    </Form>
  )
}

FormComponent.propTypes = {
  path: PropTypes.string.isRequired,
  layout: PropTypes.string,
  confirmLabel: PropTypes.string,
  confirmType: PropTypes.string,
  confirmBlock: PropTypes.bool,
  successMessage: PropTypes.string,
  paramsDecorator: PropTypes.func,
  paramsValidator: PropTypes.func,
  onResponseSuccess: PropTypes.func,
  onResponseError: PropTypes.func,
  onResponse: PropTypes.func
}

FormComponent.defaultProps = {
  layout: 'vertical',
  confirmLabel: 'cta.confirm',
  confirmType: 'primary',
  confirmBlock: false,
  successMessage: 'messages.general_success',
  paramsDecorator: (p) => p,
  paramsValidator: () => true,
  onResponse: () => true
}