import React, { useContext } from 'react'
import { Form, Input, Row, Col, Card } from 'antd'
import { MatildaContext } from 'matilda_core'
import FormComponent from 'matilda_core/components/FormComponent'

export default function AddEmailDrawer (props) {
  const { navigator, onCompleted } = props
  const { getTranslation } = useContext(MatildaContext)

  const onResponseSuccess = () => {
    navigator.closeDrawer()
    onCompleted()
  }

  return (
    <Row gutter={[15, 15]}>
      <Col xs={24} sm={24} md={24} lg={24}>
        <Card title={getTranslation("titles.add_email_address")}>
          <FormComponent
            path={'matilda_core.profile_create_email_action'}
            onResponseSuccess={onResponseSuccess}
          >
            <Form.Item
              name="email"
              label={getTranslation("labels.email")}
              rules={[{ required: true }, { type: 'email' }]}
            >
              <Input placeholder={getTranslation("helps.insert_email")}/>
            </Form.Item>
          </FormComponent>
        </Card>
      </Col>
    </Row>
  )
}