import React, { useContext, useEffect, useState } from 'react'
import { Button, notification, List, Space, Row, Col } from 'antd'
import { StarOutlined, StarFilled, DeleteOutlined } from '@ant-design/icons'
import NavigatorWrapperComponent from 'matilda_core/components/NavigatorWrapperComponent'
import { MatildaContext } from 'matilda_core'
import CardComponent from 'matilda_core/components/CardComponent'
import useRequestHook from 'matilda_core/hooks/useRequestHook'

export default function EmailsPage (props) {
  const { navigator } = props
  const { getTranslation } = useContext(MatildaContext)
  const request = useRequestHook()
  const [emails, setEmails] = useState(null)

  useEffect(() => {
    loadEmails()
  }, [])

  const loadEmails = () => {
    request.send('matilda_core.profile_index_api', {}).then((response) => {
      if (!response.result) return
      setEmails(response.payload.user_emails)
    })
  }
  
  const onDeleteEmail = (email) => {
    request.send('matilda_core.profile_remove_email_action', {email}).then((response) => {
      if(!response.result) return

      notification.success({ message: getTranslation('messages.email_delete_success') })
      loadEmails()
    })
  }

  const onTogglePrimaryEmail = (email) => {
    request.send('matilda_core.profile_toggle_email_primary_action', {email}).then((response) => {
      if(!response.result)return

      notification.success({ message: getTranslation('messages.general_success') })
      loadEmails()
    })
  }

  const onAddEmail = () => {
    navigator.openDrawer(
      'add_email_drawer', 
      { onCompleted: loadEmails }
    )
  }

  return (
    <NavigatorWrapperComponent navigator={navigator}>
      <Row gutter={[15, 15]}>
        <Col xs={{ span: 24 }} sm={{ span: 24 }}>
          <CardComponent 
            title={getTranslation("titles.email_addresses")}
            menu={[
              { label: getTranslation('cta.add'), onClick: onAddEmail }
            ]}
            contentDependOn={emails}
            content={(emails) => {
              return (
                <List 
                  bordered 
                  dataSource={emails}
                  renderItem={email => (
                  <List.Item style={{display: 'flex', justifyContent: 'space-between'}}>
                    {email.email} 
                    <Space>
                      {email.primary ? (
                        <StarFilled />
                      ) : (
                        <>
                          <Button icon={<StarOutlined/>} onClick={() => onTogglePrimaryEmail(email.email)} />
                          <Button type='danger' icon={<DeleteOutlined/>} onClick={() => onDeleteEmail(email.email)} />
                        </>
                      )}
                    </Space>
                  </List.Item>
                )} />
              )
            }}
          />
        </Col>
      </Row>
    </NavigatorWrapperComponent>
  )
}