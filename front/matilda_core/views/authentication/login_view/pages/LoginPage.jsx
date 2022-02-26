import React, { useContext, useEffect } from 'react'
import { Row, Col, Card, Form, Button, Input } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import FormComponent from 'matilda_core/components/FormComponent'

export default function LoginPage () {
  const { getTranslation, getConfig, getRoute } = useContext(MatildaContext)
  const signupRoute = getRoute("matilda_core.authentication_signup_view")
  const recoverPasswordRoute = getRoute("matilda_core.authentication_recover_password_view")
  const groupSelectRoute = getRoute('matilda_core.groups_select_view')

  const signupActiveConfig = getConfig('authentication_permit_signup')
  const loginRedirectCustomConfig = getConfig('authentication_session_valid_custom_redirect')

  /**
   * @function onLoginSuccess
   */
  const onLoginSuccess = () => {
    const loginRedirectRoute = loginRedirectCustomConfig ? getRoute(loginRedirectCustomConfig) : groupSelectRoute
    window.location.replace(loginRedirectRoute.path)
  }

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: '100%' }}>
        <Card title={getTranslation('titles.login')}>
          <FormComponent
            path='matilda_core.authentication_login_action'
            onResponseSuccess={onLoginSuccess}
            confirmLabel='cta.login'
            confirmBlock
          >
            <Form.Item
              name="username_email"
              label={getTranslation('labels.username_or_email')}
              rules={[{ required: true }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={getTranslation('helps.insert_username_or_email')}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={getTranslation('labels.password')}
              rules={[{ required: true }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={getTranslation('helps.insert_password')}
              />
            </Form.Item>
          </FormComponent>

          <div style={{ textAlign: 'right', marginTop: 15 }}>
              {signupActiveConfig && (
                <>
                  <a href={signupRoute.path}>{getTranslation('cta.signup')}</a>&#8194;|&#8194;
                </>
              )}
              <a href={recoverPasswordRoute.path}>{getTranslation('cta.recover_password')}</a>
          </div>
        </Card>
      </Col>
    </Row>
  )
}