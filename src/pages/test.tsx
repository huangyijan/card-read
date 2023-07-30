import { Button, Input } from '@nextui-org/react';
export default function test() {
  let imageUrl = '/uploads/1690661855420.jpg'

  function fetchData() {
    fetch('/api/post/read', { method: 'POST', body: JSON.stringify({imageUrl}) }).then(res => {
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

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event: any) {
      const base64String = event.target.result.split(',')[1];
      fetch('/api/post/upload-base64', {
        method: 'POST',
        body: base64String,
      })
      
    };

    reader.readAsDataURL(file);
  }

  return (
    <div>
      <Input placeholder="Next UI" type="file" id="fileInput" />
      <Button className="flex-center" onClick={fetchBase64Data}>直接读取名片数据</Button>
      {/* <Button className="flex-center" onClick={handleUpload}>上传名片</Button>
      <Button className="flex-center" onClick={fetchData}>读取名片数据</Button> */}
    </div>
  )
}