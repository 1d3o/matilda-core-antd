import React, { useContext, useEffect, useState } from "react"
import { Row, Col, Card, Form, Button, Input, Result } from "antd"
import { MatildaContext } from "matilda_core"
import FormComponent from 'matilda_core/components/FormComponent'

export default function SignupPage() {
  const { getTranslation, getRoute } = useContext(MatildaContext)
  const loginPath = getRoute("matilda_core.authentication_login_view")
  const updatePwdPath = getRoute("matilda_core.authentication_update_password_view")
  const [mailSended, setMailSended] = useState(false)

  /**
   * @function onRecoverSuccess
   */
   const onRecoverSuccess = () => {
    setMailSended(true)
  }

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: "100%" }}>
        <Card
          title={getTranslation("titles.recover_password")}
          extra={<a href={loginPath.path}>{getTranslation("cta.login")}</a>}
        >
          {mailSended ? (
            <Result 
              status="success"
              title={getTranslation("strings.recover_password_complete_title")}
              extra={<Button type="primary" href={updatePwdPath.path}>{getTranslation("cta.continue")}</Button>}
            />
          ) : (
            <FormComponent
              path='matilda_core.authentication_recover_password_action'
              onResponseSuccess={onRecoverSuccess}
              confirmBlock
            >
              <Form.Item
                name="username_email"
                label={getTranslation("labels.username_or_email")}
              >
                <Input />
              </Form.Item>
            </FormComponent>
          )}
        </Card>
      </Col>
    </Row>
  )
}
