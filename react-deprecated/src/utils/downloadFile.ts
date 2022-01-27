const getDownloadHref = (download: string, fileContent: Blob) => ({
    download,
    href: URL.createObjectURL(fileContent),
    target: '_blank'
})

export const getJsonDownloadHref = (filename: string, json: unknown) => 
    getDownloadHref(`${filename}.json`, new Blob([decodeURIComponent(encodeURI(JSON.stringify(json)))], { type: 'application/json;charset=utf-8;' }));