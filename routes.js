const fs=require('fs')
const reqHandler=(req,res)=>{
    const url=req.url;
    const method=req.method;


    if(url==='/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
}
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const message=parsedBody.split('=')[1];
            fs.writeFile('input.txt', message,(err)=>{
                res.statusCode=302;//302 Means Redirecting
                res.setHeader('Location','/')
                return res.end();
            });

        });


    }
    res.write('<html>');
    res.write('<head><title>Enter Message</title><head>');
    res.write('<body><h1>This is Test Code</h1></body>');
    res.write('</html>');
    return res.end();
};
module.exports=reqHandler;
