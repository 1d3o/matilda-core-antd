import React, { useContext } from 'react'
import { Card, List, Button, Row, Col } from 'antd'
import { MatildaContext } from 'matilda_core'
import useRequestHook from 'matilda_core/hooks/useRequestHook'

export default function SelectPage (props) {
  const { getTranslation, getConfig, getRoute } = useContext(MatildaContext)
  const request = useRequestHook()
  const permitGroupCreation = getConfig('groups_permit_creation_to_users')
  const groupsIndexView = getRoute('matilda_core.groups_index_view')

  const onSelectGroup = (groupUuid) => {
    request.send('matilda_core.groups_select_action', { group_uuid: groupUuid }).then((response) => {
      if (!response.result) return
      window.location.replace(groupsIndexView.path)
    })
  }

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 600, width: '100%' }}>
        <Card
          title={getTranslation('titles.select_a_group')}
          className="card"
          bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
          extra={[
            permitGroupCreation ? <Button key="create" type="primary">{getTranslation('cta.create')}</Button> : null
          ]}
        >
          <List
            itemLayout="horizontal"
            dataSource={props.groups}
            renderItem={item => (
              <List.Item
                actions={[
                  <a key="select" onClick={() => onSelectGroup(item.uuid)} >{getTranslation('cta.select')}</a>
                ]}
              >
                <List.Item.Meta title={item.name} />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  )
}