export function changeImg(content) {
    const gainSource = /<img[^>]*src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
    let match;
    let updatedContent = content;
    const newUrlimgList = [];
    const newNameimg = [];

    while ((match = gainSource.exec(content)) !== null) {
        const base64 = match[1];
        if (base64.startsWith("data:image") && base64.includes(";base64,")) {
            const byteString = atob(base64.split(",")[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ia], { type: "image/png" });
            const uniqueFileName = `${crypto.randomUUID()}.png`;
            const urlName = `${process.env.REACT_APP_URL}/${uniqueFileName}`;

            console.log("urlName " + urlName);

            const file = new File([blob], uniqueFileName, { type: "image/png" });
            updatedContent = updatedContent.replace(base64, urlName);
            newUrlimgList.push(file);
            newNameimg.push(urlName);
        }
    }
    return { updatedContent, newUrlimgList, newNameimg };
}