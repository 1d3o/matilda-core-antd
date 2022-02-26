import React, { useContext, useRef, useMemo, useState } from 'react'
import { Form, Row, Col, Space, Card, Checkbox } from 'antd'
import { MatildaContext } from 'matilda_core'
import FormComponent from 'matilda_core/components/FormComponent'

export default function EditPermissionsDrawer (props) {
  const { navigator, membership: { permissions: userPermissions }, user: { uuid: userUuid }, c } = props
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const membershipsPermissionsConfig = getConfig('memberships_permissions')
  const [newUserPermissions, setNewUserPermissions] = useState(userPermissions)

  const permissionsGroups = useMemo(() => {
    const groups = {}

    membershipsPermissionsConfig.forEach((permission) => {
      if (!groups[permission.group]) groups[permission.group] = []
      groups[permission.group].push(permission)
    })

    Object.entries(groups).forEach(([key, value]) => {
      groups[key] = value.sort((a, b) => a.index - b.index)
    })

    return groups
  }, [membershipsPermissionsConfig])

  /**
   * @function onCheckChange
   * @param {*} e 
   */
  const onCheckChange = (e) => {
    setNewUserPermissions(newUserPermissions.includes(e.target.id) ? newUserPermissions.filter(item => item !== e.target.id) : [...newUserPermissions, e.target.id])
  }

  /**
   * @function onPermissionsUpdated
   */
  const onPermissionsUpdated = () => {
    navigator.closeDrawer()
    onCompleted()
  }
  
  console.log(permissionsGroups)
  return (
    <FormComponent
      path='matilda_core.memberships_edit_permissions_action'
      paramsDecorator={(p) => Object.assign(p, { user_uuid: userUuid, permissions: newUserPermissions })}
      onResponseSuccess={onPermissionsUpdated}
    >
      <Row gutter={[15, 15]}>
        {permissionsGroups && Object.entries(permissionsGroups).map(([group, permissions]) => {
          return (
            <Col xs={24} sm={24} md={24} lg={24} key={group.name}>
              <Card title={getTranslation(group)}>
                  {permissions.map(permission => {
                    return (
                      <Form.Item 
                        key={permission.name}
                        name={getTranslation(permission.label)}
                      >
                        <Checkbox checked={newUserPermissions.includes(permission.name)} onChange={onCheckChange}>{getTranslation(permission.label)}</Checkbox>
                      </Form.Item>
                    )
                  })}
              </Card>
            </Col>
          )
        })}
      </Row>
    </FormComponent>
  )
}