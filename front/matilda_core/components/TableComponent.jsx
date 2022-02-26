import React, { useMemo, useRef, useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Space, Button, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { MatildaContext } from '../index'
import useRequestHook from '../hooks/useRequestHook'

export default function TableComponent (props) {
  const { columns: defaultColumns, data: defaultData, route, routePaginationParser, routeDataParser, routeParamsDecorator, paginationSetting, width, height, tableRef, selectionType, selectionOnChange, selectionBulkActions } = props
  const filtersInputRef = useRef()
  const request = useRequestHook()
  const { getTranslation } = useContext(MatildaContext)

  const [data, setData] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [paginationData, setPaginationData] = useState(paginationSetting)
  const [selectionData, setSelectionData] = useState([])

  useEffect(() => {
    if (!tableRef) return
    tableRef.current = { loadDataFromRoute, resetSelectionData, getSelectionData }
  }, [tableRef, selectionData])

  useEffect(() => {
    selectionOnChange(selectionData)
  }, [selectionData])

  const columns = useMemo(() => {
    return defaultColumns.map((column) => {
      const { dataIndex } = column

      if (column.search) {
        column = Object.assign(column, {
          filterDropdown: (functions) => <FiltersDropdown functions={functions} inputRef={filtersInputRef} dataIndex={dataIndex} title={column.title} />,
          filterIcon: (filtered) => <FiltersIcon filtered={filtered} />,
          onFilter: (value, record) => record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
          onFilterDropdownVisibleChange: visible => { if (visible) { setTimeout(() => filtersInputRef.current.select(), 100) } }
        })
      }

      return column
    })
  }, [defaultColumns])

  // gestisco il primo caricamento di dati della tabella
  useEffect(() => {
    if (route) {
      loadDataFromRoute()
    } else {
      setData(defaultData)
      setLoadingData(false)
    }
  }, [])

  /**
   * @function loadDataFromRoute
   * @param {*} pagination 
   * @param {*} sort 
   * @param {*} filters
   */
  const loadDataFromRoute = (pagination = {}, sort = {}, filters = {}) => {
    setLoadingData(true)

    // definisco parametri richiesta
    const defaultParams = {
      page: pagination?.current || 1,
      per_page: pagination?.pageSize || 25,
      sort_field: sort.field || '',
      sort_order: {ascend:'ASC',descend:'DESC'}[sort.order] || 'ASC',
      filters_keys: Object.keys(filters).join(','),
      filters_values: Object.values(filters).join(',')
    }
    const params =  Object.assign(defaultParams, routeParamsDecorator(defaultParams))

    // // invio richiesta
    request.send(route, params).then((response) => {
      if (!response.result) return

      // gestisco dati paginazione da risposta (se la paginazione e attiva)
      if (paginationSetting) {
        if (routePaginationParser) { // caso in cui la risposta viene parsata dall'esterno
          setPaginationData(routePaginationParser(response))
        } else if (response.payload?.params?.pagination) { // caso in cui la risposta viene parsata su standard matilda
          setPaginationData({ total: response.payload.params.pagination.total_items, current: response.payload.params.pagination.page, pageSize: response.payload.params.pagination.per_page })
        } else { // altri casi
          setPaginationData(pagination)
        }
      }

      // salvo dati arrivati da risposta api
      setData(routeDataParser(response))

      // disattivo loading
      setLoadingData(false)
    })
  }

  /**
   * @function resetSelectionData
   */
  const resetSelectionData = () => {
    setSelectionData([])
  }

  /**
   * @function getSelectionData
   * @returns 
   */
  const getSelectionData = () => {
    return selectionData
  }

  /**
   * @function onTableChange
   * @param {*} pagination 
   * @param {*} filters 
   * @param {*} sort 
   */
  const onTableChange = (pagination, filters, sort) => {
    loadDataFromRoute(pagination, sort, filters)
  }

  /**
   * @function onSelectionDataChange
   * @param {*} newSelectionData 
   */
  const onSelectionDataChange = (newSelectionData) => {
    setSelectionData(newSelectionData)
  }

  const dataTable = columns.length > 0 ? calculateColumnsWidth(columns, data, 300) : { width: 1024 }
  const rowSelection = selectionType ? { type: selectionType, selectedRows: selectionData, onChange: onSelectionDataChange } : null

  return (
    <Row gutter={[15, 15]}>
      <Col sm={{ span: 24 }}>
        {selectionBulkActions && <Header selectionData={selectionData} selectionBulkActions={selectionBulkActions} getTranslation={getTranslation} />}
      </Col>
      <Col sm={{ span: 24 }}>
      <Table
        columns={columns}
        loading={loadingData}
        dataSource={data}
        paginated={!!paginationSetting}
        pagination={paginationData}
        onChange={onTableChange}
        rowSelection={rowSelection}
        scroll={{ x: width || dataTable.tableWidth, y: height || null }}
        bordered
        sticky
      />
      </Col>
    </Row>
  )
}

TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array,
  route: PropTypes.string,
  routeDataParser: PropTypes.func,
  routePaginationParser: PropTypes.func,
  routeParamsDecorator: PropTypes.func,
  paginationSetting: PropTypes.any,
  width: PropTypes.number,
  height: PropTypes.number,
  tableRef: PropTypes.object,
  selectionType: PropTypes.string,
  selectionOnChange: PropTypes.func,
  selectionBulkActions: PropTypes.func
}

TableComponent.defaultProps = {
  data: [],
  routeParamsDecorator: (p) => p,
  routeDataParser: () => [],
  selectionOnChange: () => {}
}

/***************************************************************************************************** */

function Header (props) {
  const { selectionData, selectionBulkActions, getTranslation } = props
  const isActive = selectionData.length > 0
  
  return (
    <Row justify="space-between" align="middle">
      <Col>
        {isActive && (
          <>
            {getTranslation('labels.selected_items')}: {selectionData.length}
          </>
        )}
      </Col>
      <Col>
        {selectionBulkActions(!isActive)}
      </Col>
    </Row>
  )
}

function FiltersDropdown (props) {
  const { functions, inputRef, dataIndex, title } = props
  const { setSelectedKeys, selectedKeys, confirm, clearFilters } = functions

  return (
    <div style={{ padding: 8 }}>
      <Input
        ref={inputRef}
        placeholder={`Search ${title}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => confirm()}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </Space>
    </div>
  )
}

function FiltersIcon (props) {
  const { filtered } = props
  return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
}

// CALCOLO AUTOMATICO WIDTH TABLE
// https://codesandbox.io/s/wonderful-tree-ukyy5?fontsize=14&view=preview&file=/src/index.js:544-565
/********************************************************************************************************** */

/**
 * This function calculate the width of a string based on its length
 * @param {String} text
 * @param {String} font
 */
 const getTextWidth = (text, font = "14px -apple-system") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return Math.round(metrics.width + 80);
};

/**
 * This function calculates the width of each column based in all CELL VALUES
 * @param {Array} columns
 * @param {Array} source
 * @param {Number} maxWidthPerCell
 */
const calculateColumnsWidth = (
  columns,
  source,
  maxWidthPerCell = 500
) => {
  const columnsParsed = JSON.parse(JSON.stringify(columns));

  // First we calculate the width for each column
  // The column width is based on its string length

  const columnsWithWidth = columnsParsed.map(column =>
    Object.assign(column, {
      width: getTextWidth(column.title)
    })
  );

  // Since we have a minimum width (column's width already calculated),
  // now we are going to verify if the cell value is bigger
  // than the column width which is already set

  source.map(entry => {
    columnsWithWidth.map((column, indexColumn) => {
      const columnWidth = column.width;
      const cellValue = Object.values(entry)[indexColumn];

      // Get the string width based on chars length
      let cellWidth = getTextWidth(cellValue);

      // Verify if the cell value is smaller than column's width
      if (cellWidth < columnWidth) cellWidth = columnWidth;

      // Verify if the cell value width is bigger than our max width flag
      if (cellWidth > maxWidthPerCell) cellWidth = maxWidthPerCell;

      // Update the column width
      columnsWithWidth[indexColumn].width = cellWidth;
    });
  });

  // Sum of all columns width to determine the table max width
  const tableWidth = columnsWithWidth
    .map(column => column.width)
    .reduce((a, b) => {
      return a + b;
    });

  return {
    columns: columnsWithWidth,
    source,
    tableWidth
  };
};
