const Cart=require('./cart');
const db=require('../util/databse')
module.exports=class Product{
    constructor(id,title,price,discription,imageUrl){
        this.id=id;
        this.title=title;
        this.imageUrl=imageUrl;
        this.discription=discription;
        this.price=price;
    };

    save() {
       return db.execute('INSERT INTO products (title,price,discription,imageUrl) VALUES(?,?,?,?)',
        [this.title,this.price,this.discription,this.imageUrl]);

       
}

    static delete(id){
       
    }
      
    

    static fetchAll(){
        return db.execute('SELECT * FROM products ')
}
    static findById(id){
        return db.execute('SELECT * FROM products where products.id=?',[id])
    }
};