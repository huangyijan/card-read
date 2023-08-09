export function download(buff){

    let url = window.URL.createObjectURL(new Blob( [buff], {type: "arraybuffer"}) )
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', '名片.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
  }

