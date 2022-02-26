import React, { useContext, useRef } from 'react'
import { Button, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import NavigatorWrapperComponent from 'matilda_core/components/NavigatorWrapperComponent'
import TableComponent from 'matilda_core/components/TableComponent'

export default function IndexPage (props) {
  const { navigator } = props 
  const { getTranslation } = useContext(MatildaContext)
  const tableRef = useRef()

  const tableColumns = [
    {
      key: 'username',
      dataIndex: 'username',
      title: getTranslation('labels.username'),
      sorter: true,
    },
    {
      key: 'surname',
      dataIndex: 'surname',
      title: getTranslation('labels.surname'),
      responsive: ['md'],
      sorter: true,
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: getTranslation('labels.name'),
      responsive: ['md'],
      sorter: true,
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: getTranslation('labels.email'),
      sorter: true,
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'uuid',
      width: 200,
      align: 'center',
      render: (d) => renderTableAction(d)
    }
  ]

  /**
   * @function onClickManage
   * @param {*} userUuid 
   */
  const onClickManage = (userUuid) => {
    navigator.goToPage('manage_page', { userUuid })
  }

  /**
   * @function onClickInvite
   */
  const onClickInvite = () => {
    navigator.openDrawer('invite_drawer', { onCompleted: onCompletedInvite })
  }

  /**
   * @function onCompletedInvite
   */
  const onCompletedInvite = () => {
    tableRef.current.loadDataFromRoute()
  }

  /**
   * @function renderTableAction
   * @param {*} userUuid 
   * @returns 
   */
  const renderTableAction = (userUuid) => {
    return (
      <Button type="primary" onClick={() => onClickManage(userUuid)} ghost block>{getTranslation('cta.manage')}</Button>
    )
  }

  return (
    <NavigatorWrapperComponent
      navigator={navigator}
      menu={[
        { label: getTranslation('cta.invite'), onClick: onClickInvite }
      ]}
    >
      <TableComponent
        columns={tableColumns}
        route='matilda_core.memberships_index_api'
        routeDataParser={(response) => response.payload.users.map((user) => ({ key: user.uuid, uuid: user.uuid, email: user.email, username: user.username, surname: user.surname, name: user.name }))}
        paginationSetting
        tableRef={tableRef}
      />
    </NavigatorWrapperComponent>
  )
}