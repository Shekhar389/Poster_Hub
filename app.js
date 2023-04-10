const http=require('http');
const server=http.createServer((req,res)=>{

    const url=req.url;
    const method=req.method;
    if(url==='/'){
        res.write('<html><head><title></title></head><body><h1>Welcome to the website</h1>');
        res.write('<h1>UserName</h1>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Create</button></form>');
        res.write('</body></html>');
        res.end();
    }
    if(url==='/user'){
        res.write('<html><head><title></title></head><body><h1>User1</h1>');
        res.write('<h1>User2</h1>');
        res.write('<h1>User3</h1>');
        res.write('</body></html>');
        res.end();
    }
    if(url=== '/create-user'&& method==='POST'){
        const body=[];
        req.on('data',(chunk)=>{
            body.push(chunk);
        })
        req.on('end',()=>{
            const parsedBody=Buffer.concat(body).toString();
            const username=(parsedBody).split('=')[1];
            console.log(username);
        })

        res.statusCode=302;//302 Means Redirecting
        res.setHeader('Location','/');
        return res.end();
    }

});
server.listen(3000);

