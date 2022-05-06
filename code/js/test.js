
 console.log('1');
new Promise((resolve,reject)=>{
    console.log('2');
    resolve()
    new Promise((resolve)=>{
        console.log('6')
        resolve()
    }).then(()=>{
        console.log('7');
    }).then(()=>{
        console.log('8');
    })
}).then(()=>{
    console.log('4');
}).then(()=>{
    console.log('5');
})

console.log('3');