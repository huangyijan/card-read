import { Button, Col, FormElement, Input, Row, Table, Text, Image, User } from '@nextui-org/react';
import React, { useState, useEffect, useRef } from 'react'
import { connectToDatabase } from './api/database';
import { Card } from '@/entity/card';
import { CardDataMap } from '@/utils/constants';
import { download } from '@/utils';



export default function CardPage({ list }) {
  let imageUrl = '/uploads/1690661855420.jpg'
  const [cards, setCards] = useState<any[]>(list)
  const uploadInput = useRef(null as FormElement | null)

  useEffect(() => {
    // ...
  }, []);

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

  const columns = Array.from(CardDataMap).map(item => ({ key: item[1], label: item[0] })).filter(item => !item.key.startsWith('en_') && item.key !== 'mobile')

  function fetchData() {
    fetch('/api/get/list').then(res => {
      return res.json()
    }).then(res => {
      setCards(res.list.map(item => {
        if (item.en_apartment) item.apartment += ` ${item.en_apartment}`
        if (item.en_compony) item.compony += ` ${item.en_compony}`
        if (item.en_position) item.position += ` ${item.en_position}`
        if (item.en_name) item.name += ` ${item.en_name}`
        if (item.mobile) item.phone += ` ${item.mobile}`
        item.url = 'http://47.106.107.179:3001/'+ item.url.split('public/')[1]
        return { ...item }
      }))
    })
  }


  function handleUpload() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    if (fileInput.files?.length === 0) {
      alert('请先选择一个文件！');
      return;
    }

    const file = fileInput.files?.[0] || '';
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/post/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        imageUrl = data.filename
      })
      .catch(error => console.error('Error:', error));
  }

  function handleFileChange(e) {
    const files = e.target?.files || []
    const formData = new FormData()
    for(const file of files) {
      formData.append('files', file)
    }
    console.log(files);
    fetch('/api/post/upload-formdata', {
      method: 'POST',
      body: formData,
    }).then(res => {
      fetchData()
    })

  }


  function uploadFile(file: File) {
    return new Promise<void>(resolve => {
      const reader = new FileReader();

      reader.onload = function (event: any) {
        const base64String = event.target.result.split(',')[1];
        fetch('/api/post/upload-base64', {
          method: 'POST',
          body: base64String,
        }).then(res => {
          resolve()
        })

      };

      reader.readAsDataURL(file);
    })

  }


  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User squared src={user.url} name={cellValue} css={{ p: 0 }}>
            {user.email}
          </User>
        );
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
        case "url":
          return (
            <Image
            width={160}
            alt="名片图片"
            src={user.url}
            objectFit="contain"
          ></Image>
          )

     default:
        return cellValue;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <Input ref={uploadInput} placeholder="Next UI" type="file" id="fileInput" multiple onChange={handleFileChange} style={{ display: 'none' }} />
        <Button className="flex-center mb-50" onClick={() => uploadInput.current?.click()} style={{ marginLeft: 50 }}>上传名片</Button>
        <Button className="flex-center mb-50" onClick={handleDownload} style={{ marginLeft: 50 }}>下载excel</Button>
      </div>
      {/* <Button className="flex-center" onClick={handleUpload}>上传名片</Button>
      <Button className="flex-center" onClick={fetchData}>读取名片数据</Button> */}
      <Table
        striped
        sticked
        bordered
        aria-label="Example static collection table"
        lined
        headerLined
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column align="center" width={500} key={column.key}>{column.label}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={cards}>
          {(item: any) => (
            <Table.Row key={item.id} >
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}


export async function getStaticProps(context) {
  const db = await connectToDatabase()
  const res = await db.getRepository(Card).find()
  const list = res.map(item => {
    if (item.en_apartment) item.apartment += ` ${item.en_apartment}`
    if (item.en_compony) item.compony += ` ${item.en_compony}`
    if (item.en_position) item.position += ` ${item.en_position}`
    if (item.en_name) item.name += ` ${item.en_name}`
    if (item.mobile) item.phone += ` ${item.mobile}`
    item.url = 'http://47.106.107.179:3001/'+ item.url.split('public/')[1]
    return { ...item }
  })

  return {
    props: {
      list,
    },
  }
}

