import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Alert, Row, Col, Card, Space } from 'antd'
import { MatildaContext } from 'matilda_core'
import FormComponent from 'matilda_core/components/FormComponent'

export default function InviteDrawer (props) {
  const { navigator, onCompleted } = props
  const { getTranslation } = useContext(MatildaContext)

  const onResponseSuccess = () => {
    onCompleted()

    navigator.closeDrawer()
    return true
  }

  return (
    <Row gutter={[15, 15]}>
      <Col sm={24}>
        <Card title={getTranslation("titles.invite_user")}>
          <Space direction="vertical" size='large' style={{ width: '100%' }}>
            <Alert
              message={getTranslation('helps.invitation_user_guide')}
              type="info"
            />

            <FormComponent
              path='matilda_core.memberships_invitation_action'
              onResponseSuccess={onResponseSuccess}
            >
              <Form.Item
                name="name"
                label={getTranslation('labels.name')}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="surname"
                label={getTranslation('labels.surname')}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label={getTranslation('labels.email')}
                rules={[{ required: true }]}
              >
                <Input type="email" />
              </Form.Item>
            </FormComponent>
          </Space>
        </Card>
      </Col>
    </Row>
  )
}

InviteDrawer.propTypes = {
  onCompleted: PropTypes.func.isRequired
}