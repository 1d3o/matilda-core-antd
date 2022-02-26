import React, { useContext, useEffect } from "react"
import { Row, Col, Card, Form, Button, Input } from "antd"
import { MatildaContext } from "matilda_core"
import FormComponent from 'matilda_core/components/FormComponent'

export default function SignupPage() {
  const { getTranslation, getRoute } = useContext(MatildaContext)
  const loginPath = getRoute("matilda_core.authentication_login_view")

  /**
   * @function onSignupSuccess
   */
   const onSignupSuccess = () => {
    window.location.replace(loginPath.path)
  }

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: "100%" }}>
        <Card 
          title={getTranslation("titles.signup")}
          extra={<a href={loginPath.path}>{getTranslation("cta.login")}</a>}
        >
          <FormComponent
            path='matilda_core.authentication_signup_action'
            onResponseSuccess={onSignupSuccess}
            confirmBlock
          >
            <Form.Item
              name="name"
              label={getTranslation("labels.name")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="surname"
              label={getTranslation("labels.surname")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label={getTranslation("labels.username")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label={getTranslation("labels.email")}
              rules={[{ required: true }, { type: 'email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label={getTranslation("labels.password")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              label={getTranslation("labels.password_confirmation")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          </FormComponent>
        </Card>
      </Col>
    </Row>
  )
}
