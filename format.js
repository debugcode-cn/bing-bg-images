
function formatDate(){
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let i = date.getMinutes();
    let s = date.getSeconds();
    return {
        y,
        m,
        d,
        h,
        i,
        s,
        toDateTime:()=>{
            return [y,m,d].join('-') + ' ' + [h,i,s].join(':');
        },
        toDate:()=>{
            return [y,m,d].join('-');
        }
    }
}

function formatSize(bytes){
    return (bytes/ 1024 / 1024 ).toFixed(2) + 'MB';
}

module.exports = {formatDate , formatSize};