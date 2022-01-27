const fetch = require('node-fetch');

async function fetchFileAsync(key) {
    const url = `https://api.jsonstorage.net/v1/json/${key}`;
    try {
      const response = await fetch(url);
      return response.json();
    } catch (e) {
      console.log(`Could not fetch from ${url}`);
    }
    return {};
  }

async function getResult(listDBs, fileToRead) {
    if (fileToRead)
    {
        const keyToGet = listDBs.Dbs ? listDBs.Dbs.find(t => t.Name === fileToRead) : undefined;
        return keyToGet && keyToGet.Bin ? await fetchFileAsync(keyToGet.Bin) : undefined;
    } else {
        // If no file was requested, return the list of db's instead (with hidden Bins)
        return listDBs && listDBs.Dbs && listDBs.Dbs.length ? {...listDBs, Dbs: listDBs.Dbs.map(({Bin, ...rest}) => ({...rest}))} : undefined;
    }
}

exports.handler = async function(event) {
    const fileToRead = event.queryStringParameters.file;
    const listDBs = await fetchFileAsync(process.env.VITE_STORAGE_MASTERKEY);
    const result = await getResult(listDBs, fileToRead);
    
    return {
        statusCode: 200,
        // body: JSON.stringify({message: 'hello there !!!', fileToRead, keyToGet, result, listDBs, key: process.env.VITE_STORAGE_MASTERKEY})
        body: JSON.stringify(result)
    }
}