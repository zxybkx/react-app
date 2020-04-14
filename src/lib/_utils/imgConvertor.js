export const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};



export const convertToSize = async (src, size, callback) => {
  const imgUrl = await getBase64(src);
  const img = new Image();
  img.src = imgUrl;
  img.onload = ()=> {
    const elem = document.createElement('canvas');
    const {width, height} = size;
    elem.width = width;
    elem.height = height;
    const ctx = elem.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const data = ctx.canvas.toDataURL();
    callback(data);
  }
};
