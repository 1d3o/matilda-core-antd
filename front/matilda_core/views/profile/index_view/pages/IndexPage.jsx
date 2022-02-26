import React, { useContext, useEffect, useState, useRef } from 'react'
import { Card, Form, Input, notification, Row, Col } from 'antd'
import { MatildaContext } from 'matilda_core'
import NavigatorWrapperComponent from 'matilda_core/components/NavigatorWrapperComponent'
import CardComponent from 'matilda_core/components/CardComponent'
import FormComponent from 'matilda_core/components/FormComponent'
import useRequestHook from 'matilda_core/hooks/useRequestHook'

export default function IndexPage (props) {
  const { navigator } = props
  const request = useRequestHook()
  const { getTranslation } = useContext(MatildaContext)
  const [user, setUser] = useState(null)
  const formRef = useRef()

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (!user) return

    formRef.current.antdForm.setFieldsValue({
      name: user.name,
      surname: user.surname
    })
  }, [user])

  const loadUser = () => {
    request.send('matilda_core.profile_index_api', {}).then((response) => {
      if (!response.result) return
      setUser(response.payload.user)
    })
  }

  const onResponseSuccess = () => {
    notification['success']({ message: getTranslation('messages.user_update_success') })
  }

  return (
    <NavigatorWrapperComponent navigator={navigator} >
      <Row gutter={[15, 15]}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }}>
          <CardComponent 
            title={getTranslation("titles.personal_informations")}
            contentDependOn={user}
            content={(user) => {
              return (
                <FormComponent 
                  path='matilda_core.profile_edit_info_action'
                  onResponseSuccess={onResponseSuccess}
                  formRef={formRef}
                >
                  <Form.Item
                    name="name"
                    label={getTranslation("labels.name")}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="surname"
                    label={getTranslation("labels.surname")}
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