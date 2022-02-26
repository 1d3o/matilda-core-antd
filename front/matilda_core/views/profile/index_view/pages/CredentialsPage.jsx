import React, { useContext, useEffect, useState, useRef } from 'react'
import { Form, Input, Row, Col, notification } from 'antd'
import { MatildaContext } from 'matilda_core'
import NavigatorWrapperComponent from 'matilda_core/components/NavigatorWrapperComponent'
import CardComponent from 'matilda_core/components/CardComponent'
import FormComponent from 'matilda_core/components/FormComponent'
import useRequestHook from 'matilda_core/hooks/useRequestHook'

export default function CredentialsPage (props) {
  const { navigator } = props
  const request = useRequestHook()
  const { getTranslation } = useContext(MatildaContext)
  const [username, setUsername] = useState(null)
  const formUsernameRef = useRef()

  useEffect(() => {
    loadUsername()
  }, [])

  useEffect(() => {
    if (!username) return
    formUsernameRef.current.antdForm.setFieldsValue({ username: username })
  }, [username])

  const loadUsername = () => {
    request.send('matilda_core.profile_index_api', {}).then((response) => {
      if (!response.result) return
      setUsername(response.payload.user.username)
    })
  }

  const onResponseSuccess = () => {
    notification['success']({ message: getTranslation('messages.user_update_success') })
    loadUsername()
  }

  return (
    <NavigatorWrapperComponent navigator={navigator}>
      <Row gutter={[15, 15]}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }}>
          <CardComponent
            title={getTranslation("titles.update_password")}
            contentDependOn={username}
            content={(username) => {
              return (
                <FormComponent
                  path='matilda_core.profile_edit_password_action'
                  onResponseSuccess={onResponseSuccess}
                >
                  <Form.Item
                    name="password_old"
                    label={getTranslation("labels.current_password")}
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={getTranslation("labels.new_password")}
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="password_confirmation"
                    label={getTranslation("labels.new_password_confirmation")}
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>
                </FormComponent>
              )
            }}
          />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 24 }}>
          <CardComponent
            title={getTranslation("titles.update_username")}
            contentDependOn={username}
            content={(username) => {
              return (
                <FormComponent
                  path='matilda_core.profile_edit_username_action'
                  onResponseSuccess={onResponseSuccess}
                  formRef={formUsernameRef}
                >
                  <Form.Item
                    name="username"
                    label={getTranslation("labels.username")}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </FormComponent>
              )
            }}
          />
        </Col>
      </Row>

    </NavigatorWrapperComponent>
  )
}