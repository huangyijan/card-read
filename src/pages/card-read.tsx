import { Button, Col, Input, Row, Table, Text, User, Tooltip, Progress } from '@nextui-org/react';
import React, { useState, useEffect, useRef } from 'react'
import { connectToDatabase } from './api/database';
import { Card } from '@/entity/card';
import { download } from '@/utils';





export default function CardPage({ list }) {
  let imageUrl = '/uploads/1690661855420.jpg'
  const [cards, setCards] = useState<any[]>(list)
  const uploadInput = useRef(null as any)
  const [page, setPage] = React.useState(1);
  const [progress, setProgress] = React.useState(0)
  const pages = 100

  useEffect(() => {
    handleUploadProgress()
  }, []);

  /** 获取上传进度 */
  function handleUploadProgress() {
    var source = new EventSource('/api/get/sse');
    source.onopen = function (e) {
      console.log("open")
    };
    source.onmessage = function (e) {
      console.log(+e.data);
      if (!Number.isNaN(Number(e.data))) setProgress(+e.data)
    }

    source.onerror = function (e) {
      console.log("error")
      source.close()
    }
  }

  function test() {
    fetch('api/get/test')
  }

  function handleDownload() {
    fetch('/api/get/excel', {
      method: 'get',
      responseType: 'arraybuffer'
    } as any).then(res => {
      return res.arrayBuffer();
    }).then(buffer => {
      console.log(buffer);
      download(buffer)

    })
  }

  const columns = [
    { key: "actions", label: "操作" },
    { key: 'id', label: 'ID' },
    { key: 'name', label: '姓名' },
    { key: 'compony', label: '公司' },
    { key: 'phone', label: '手机' },
    { key: 'email', label: '邮箱' },
    { key: 'position', label: '职位' },
  ]


  function fetchData() {
    fetch('/api/get/list').then(res => {
      return res.json()
    }).then(res => {
      setProgress(0)
      setCards(res.list.map(item => {
        if (item.en_apartment) item.apartment += ` ${item.en_apartment}`
        if (item.en_compony) item.compony += ` ${item.en_compony}`
        if (item.en_position) item.position += ` ${item.en_position}`
        if (item.en_name) item.name += ` ${item.en_name}`
        if (item.mobile) item.phone += ` ${item.mobile}`
        item.url = process.env.HOST_URL || '' + item.url.split('public/')[1]
        return { ...item }
      }))
    })
  }

  function handleFileChange(e) {
    const files = e.target?.files || []
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    fetch('/api/post/upload-formdata', {
      method: 'POST',
      body: formData,
    }).then(res => {
      fetchData()
    })

  }


  const renderCell = (user, columnKey) => {

    function handleDelete(user) {
      fetch('/api/delete/user?id=' + user.id).then(() => {
        fetchData()
      })
    }

    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User squared src={user.url} name={cellValue} css={{ p: 0 }}>
            {user.email}
          </User>
        );
      case "email":
        return cellValue || '未识别';
      case "role":
        return (
          <Col>
            <Row>
              <Text b size={14} css={{ tt: "capitalize" }}>
                {cellValue}
              </Text>
            </Row>
            <Row>
              <Text b size={13} css={{ tt: "capitalize", color: "$accents7" }}>
                {user.team}
              </Text>
            </Row>
          </Col>
        );
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Button size="xs" color="error" light onClick={() => handleDelete(user)}>
                删除
              </Button>
            </Col>
          </Row>
        );
      default:
        return (
          <div style={{ maxWidth: '350px', whiteSpace: 'break-spaces' }}>
            {cellValue}
          </div>
        );
    }
  };


  return (
    <div style={{ padding: 20 }}>
      {progress ? <Progress value={progress} color="gradient" style={{ padding: '0 50' }} /> : ''}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <Input ref={uploadInput} placeholder="Next UI" type="file" id="fileInput" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        <Button size="sm" className="flex-center mb-50" onPress={() => uploadInput.current?.click()}>上传名片</Button>
        <Button size="sm" className="flex-center mb-50" onPress={handleDownload} style={{ marginLeft: 50 }}>下载excel</Button>
        <Button size="sm" className="flex-center mb-50" onPress={test} style={{ marginLeft: 50 }}>测试按钮</Button>
      </div>
      <Table
        striped
        sticked
        bordered
        aria-label="Example static collection table async  pagination"
        lined
        headerLined
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        selectionMode="multiple"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column align="center" key={column.key}>{column.label}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={cards}>
          {(item: any) => (
            <Table.Row key={item.id}>
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          shadow
          noMargin
          align="center"
          rowsPerPage={8}
          onPageChange={(page) => console.log({ page })}
        />
      </Table>
    </div>
  )
}


export async function getStaticProps(context) {
  const db = await connectToDatabase()
  const res = await db.getRepository(Card).find({
    order: {
        id: "DESC",
    },
})
  const list = res.map(item => {
    if (item.en_apartment) item.apartment += ` ${item.en_apartment}`
    if (item.en_compony) item.compony += ` ${item.en_compony}`
    if (item.en_position) item.position += ` ${item.en_position}`
    if (item.en_name) item.name += ` ${item.en_name}`
    if (item.mobile) item.phone += ` ${item.mobile}`
    item.url = process.env.HOST_URL + item.url.split('public/')[1]
    return { ...item }
  })

  return {
    props: {
      list,
    },
  }
}

