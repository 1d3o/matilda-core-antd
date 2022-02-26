import React, { useContext, useState } from "react"
import { Row, Col, Card, Form, Input, Result } from "antd"
import { MatildaContext } from "matilda_core"
import FormComponent from "matilda_core/components/FormComponent"

export default function UpdatePasswordPage(props) {
  const { userUuid } = props
  const { getTranslation, getRoute } = useContext(MatildaContext)
  const loginPath = getRoute("matilda_core.authentication_login_view")
  const [updated, setUpdated] = useState(false)

  /**
   * @function onUpdateSuccess
   */
   const onUpdateSuccess = () => {
    setUpdated(true)
  }

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: "100%" }}>
        <Card
          title={getTranslation("titles.recover_password")}
          extra={<a href={loginPath.path}>{getTranslation("cta.login")}</a>}
        >
          {updated ? (
            <Result 
              status="success"
              title={getTranslation("strings.update_password_complete_title")}
              extra={<a href={loginPath.path}>{getTranslation("cta.continue")}</a>}
            />
          ) : (
            <FormComponent
              path='matilda_core.authentication_update_password_action'
              onResponseSuccess={onUpdateSuccess}
              paramsDecorator={(p) => Object.assign(p, { user_uuid: userUuid })}
              confirmBlock
            >
              <Form.Item
                name="recover_password_code"
                label={getTranslation("labels.security_code")}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label={getTranslation("labels.new_password")}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label={getTranslation("labels.new_password_confirmation")}
              >
                <Input.Password />
              </Form.Item>
            </FormComponent>
          )}
        </Card>
      </Col>
    </Row>
  )
}
