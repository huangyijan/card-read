import { Button, Input, Table } from '@nextui-org/react';
import React, { useState } from 'react'
import { connectToDatabase } from './api/database';
import { Card } from '@/entity/card';
import { CardDataMap } from '@/utils/constants';
export default function CardPage({ list }) {
  let imageUrl = '/uploads/1690661855420.jpg'
  const columns = Array.from(CardDataMap).map(item => ({ key: item[1], label: item[0] })).filter(item => !item.key.startsWith('en_') && item.key !== 'mobile')


  function fetchData() {
    fetch('/api/post/read', { method: 'POST', body: JSON.stringify({ imageUrl }) }).then(res => {
      console.log(res);
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


  function fetchBase64Data() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    if (fileInput.files?.length === 0) {
      alert('请先选择一个文件！');
      return;
    }

    const file = fileInput.files![0];
    const reader = new FileReader();

    reader.onload = function (event: any) {
      const base64String = event.target.result.split(',')[1];
      fetch('/api/post/upload-base64', {
        method: 'POST',
        body: base64String,
      }).then(res => {
        
      })

    };

    reader.readAsDataURL(file);
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
        <Input placeholder="Next UI" type="file" id="fileInput" />
        <Button className="flex-center mb-50" onClick={fetchBase64Data} style={{ marginLeft: 50 }}>直接读取名片数据</Button>
        <Button className="flex-center mb-50" onClick={fetchBase64Data} style={{ marginLeft: 50 }}>下载excel</Button>
      </div>
      {/* <Button className="flex-center" onClick={handleUpload}>上传名片</Button>
      <Button className="flex-center" onClick={fetchData}>读取名片数据</Button> */}
      <Table
        striped
        sticked
        selectionMode="multiple"
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
        <Table.Body items={list}>
          {(item: any) => (
            <Table.Row key={item.id} >
              {(columnKey) => <Table.Cell>{item[columnKey] || '无'}</Table.Cell>}
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
    return { ...item }
  })

  return {
    props: {
      list,
    },
  }
}

