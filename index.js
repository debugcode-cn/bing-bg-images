const fs = require('fs');
const https = require('https');
const URL = require('url');
const events = require('events');

const { formatDate, formatSize } = require('./format.js');
const schedule = require('node-schedule');

exports.downloadBingBGI = function(){
    const base_url = 'https://cn.bing.com/';

    https.get(base_url, (res)=>{
        let emiter = new events.EventEmitter();
        emiter.once('url-created',(url)=>{
            emiter.url = url;
            https.get(url,(res)=>{
                let date_string =  formatDate().toDate();
                console.log('date_string',date_string)
                res.pipe(fs.createWriteStream('./bing-'+date_string+'.jpg'))
            });
        })
        res.setEncoding('utf8');

        let bufferStore = Buffer.alloc(0)
        res.on('data',(buffer)=>{
            if(emiter.url){
                return true;
            }
            bufferStore = Buffer.concat([bufferStore,Buffer.from(buffer)]);
            let m = bufferStore.toString().match(/data-ultra-definition-src="([^"]+)"/);
            let mem = process.memoryUsage()
            console.log('process.mem', 'rss:'+formatSize(mem.rss) ,'heapTotal:'+formatSize(mem.heapTotal) ,'heapUsed:'+formatSize(mem.heapUsed)  ,'external:'+formatSize(mem.external), 'arrayBuffers:'+formatSize(mem.arrayBuffers)  )
            if(m && m[1]){
                let img_url = URL.resolve(base_url,m[1])
                emiter.emit('url-created',img_url);
            }
        })
        res.on('error',(err)=>{
            console.err(err);
        })
    });
}

let every_day_0 = '0 1 * * * *'
schedule.scheduleJob(every_day_0, exports.downloadBingBGI);