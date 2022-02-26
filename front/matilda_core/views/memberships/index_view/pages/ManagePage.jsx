import React, { useMemo, useState, useEffect, useContext, useRef } from 'react'
import { Row, Col, Descriptions, Form, Select, Button } from 'antd'
import { MatildaContext } from 'matilda_core'
import useRequestHook from 'matilda_core/hooks/useRequestHook'
import NavigatorWrapperComponent from 'matilda_core/components/NavigatorWrapperComponent'
import FormComponent from 'matilda_core/components/FormComponent'
import CardComponent from 'matilda_core/components/CardComponent'

export default function ManagePage (props) {
  const { navigator, userUuid } = props
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const request = useRequestHook()
  const formRef = useRef()
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)
  const permissionsRoleConfig = getConfig('memberships_permissions_roles')
  const showPermissionsEditorConfig = getConfig('memberships_show_permissions_editor')

  const rolesOptions = useMemo(() => {
    let items = []

    if (permissionsRoleConfig) permissionsRoleConfig.map(i => { items.push({ label: getTranslation(i.label), value: i.name }) })

    return items
  }, [permissionsRoleConfig])

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if(!membership?.permissions_role || !formRef.current) return
    formRef.current.antdForm.setFieldsValue({ role: membership.permissions_role })
  }, [membership, formRef])

  /**
   * @function loadUserData
   */
  const loadUserData = () => {
    request.send('matilda_core.memberships_manage_api', { user_uuid: userUuid }).then((response) => {
      if (!response.result) return
      setUser(response.payload.user)
      setMembership(response.payload.membership)
    })
  }

  /**
   * @function onPermissionsUpdated
   * @returns 
   */
  const onPermissionsUpdated = () => {
    loadUserData()
  }

  /**
   * @function onClickEditPermissions
   */
  const onClickEditPermissions = () => {
    navigator.openDrawer(
      'edit_permissions_drawer', 
      { user, membership, onCompleted: onPermissionsUpdated }
    )
  }

  return (
    <NavigatorWrapperComponent navigator={navigator}>
      <Row gutter={[15, 15]}>
        <Col xs={24} sm={24} md={12} lg={16}>
          <CardComponent
            title={getTranslation("titles.informations")}
            contentDependOn={user}
            content={(user) => <UserDescription user={user} getTranslation={getTranslation} />}
          />
        </Col>

        <Col xs={24} sm={24} md={12} lg={8}>
          <CardComponent
            title={getTranslation("titles.edit_permissions_role")}
            menuDependOn={user}
            menu={[
              showPermissionsEditorConfig ? { label: getTranslation("titles.edit_permissions"), onClick: onClickEditPermissions } : null
            ]}
            contentDependOn={user}
            content={(user) => <UserRoleForm user={user} getTranslation={getTranslation} rolesOptions={rolesOptions} formRef={formRef} onPermissionsUpdated={onPermissionsUpdated} />}
          />
        </Col>
      </Row>
    </NavigatorWrapperComponent>
  )
}

function UserDescription ({ user, getTranslation }) {
  return (
    <Descriptions 
      bordered
      column={{xs: 1, sm: 1, md: 1, lg: 2}}
    >
      <Descriptions.Item label={getTranslation("labels.name")}>{user.name || ' - '}</Descriptions.Item>
      <Descriptions.Item label={getTranslation("labels.surname")}>{user.surname || ' - '}</Descriptions.Item>
      <Descriptions.Item label={getTranslation("labels.username")}>{user.username || ' - '}</Descriptions.Item>
      <Descriptions.Item label={getTranslation("labels.email")}>{user.email || ' - '}</Descriptions.Item>
      <Descriptions.Item label={getTranslation("labels.registration_date")}>{user.created_at || ' - '}</Descriptions.Item>
      <Descriptions.Item label={getTranslation("labels.last_access_date")}></Descriptions.Item>
    </Descriptions>
  )
}

function UserRoleForm ({ user, onPermissionsUpdated, rolesOptions, formRef, getTranslation }) {
  return (
    <FormComponent
      path='matilda_core.memberships_edit_permissions_role_action'
      paramsDecorator={(p) => Object.assign(p, { user_uuid: user.uuid })}
      onResponseSuccess={onPermissionsUpdated}
      formRef={formRef}
    >
      <Form.Item
        name="role"
        label={getTranslation("labels.role")}
      >
        <Select options={rolesOptions} />
      </Form.Item>
    </FormComponent>
  )
}