const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const http = require('http');
const https = require('https');
const mime = require('mime-types');
const { v4: uuidv4 } = require('uuid');

const form = new FormData();
function DaU(urlinput){
//CONSULTA A API DO COBALT
    const data = {
        url: encodeURIComponent(urlinput),
    };
    axios.post('https://d.gahtee.com/api/json', data, {
            headers: {
            'accept': 'application/json'
            }
        }).then(response => {
            const uuid = `${uuidv4()}`;
            https.get(response.data.url, (res) => {
                const contentType = res.headers['content-type'];
                const extension = mime.extension(contentType) || 'unknown';
                const tempFile = `${uuid}.${extension}`;
                const writeStream = fs.createWriteStream(tempFile);
                res.pipe(writeStream);
                writeStream.on('finish', () => {
                    //SUBIR ARQUIVO PARA O f.gahtee.com
                    const url = 'https://f.gahtee.com';
                    const apipage = '/script.php';
                    const proxy = '';
                    const options = '-k';
                    const time = 'day';
                    const filePath = `${tempFile}`;

                    if (filePath.startsWith('http') || filePath.startsWith('https')) {
                        form.append('file', encodeURIComponent(filePath));
                    } else {
                        form.append('file', fs.createReadStream(filePath));
                    }
                    form.append('time', time);

                    axios.post(url + apipage, form, {
                    httpAgent: new http.Agent({ keepAlive: true, rejectUnauthorized: false }),
                    httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }),
                    headers: {
                        ...form.getHeaders(),
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                    }).then((res) => {
                    console.log('https://f.gahtee.com/f.php?h='+res.data.split('\n')[0]);
                    fs.unlinkSync(tempFile);
                    }).catch((error) => {
                    console.error(error);
                    fs.unlinkSync(tempFile);
                    });
        });
    });
    });
}

module.exports = {
    DaU
}    