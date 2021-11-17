const path=require('path');
const express=require('express');
const mysql=require('mysql');
const bodyparser=require('body-parser');
const ejs=require('ejs');
let app=express();
let multer=require('multer');

let connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project',
    password: 'Subham@96'
});
connection.connect((err)=>{
    if(err)throw err;
    console.log('connection successful');
})
app.listen(7000,()=>{
        console.log('The server start on port number 7000');
});
//using middlewire
app.set('/views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//for image part
app.use('/static',express.static(path.join(__dirname,'/static')));
//for javascript
app.use('/javascript',express.static(path.join(__dirname,'/javascript')));
//for admin login page details
app.get('/admin',(req,res)=>{
    res.render('adminlogin',{title:'admin login',context:true})
});
//middlewire for multer
const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
      cb(null,'static');
    },
    filename:(req,file,cb)=>{
      console.log(file);
      cb(null,Date.now() +path.extname(file.originalname));
    },
  });
const static=multer({storage:storage});
//for admin check the email and password of admin and move to userdetails page
app.post('/adminlogin',(req,res)=>{
    let data=[req.body.email,req.body.password];
    let sql="select * from Userdetails";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        if(data[0]==='dashsubham095@gmail.com' && data[1]==='subham96'){
            res.render('userdetails',{title:'userdetails',user:rows})
        }
        if(data[0]!='dashsubham095@gmail.com' && data[1]!='subham96'){
            res.render('adminlogin',{title:'admin login',context:false})
        }
    });
});
//for Userdetails in admin part
app.get('/userdetails',(req,res)=>{
    let sql="select * from Userdetails";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        res.render('userdetails',{title:'userdetails',user:rows})
    });    
});
//for delete the data through admin in userdetails
app.get('/userdetailsadmindelete/:sl_no',(req,res)=>{
    let sql="DELETE FROM Userdetails WHERE sl_no = ?";
    connection.query(sql,[req.params.sl_no],(err,rows)=>{
        if(err)throw err;
        res.redirect('/userdetails');
    });
});
//for edit admin edit page in userdetails page
app.get('/userdetailsadminedit/:sl_no',(req,res)=>{
    let sql="select * from Userdetails where sl_no=?";
    connection.query(sql,[req.params.sl_no],(err,rows)=>{
        if(err)throw err;
        res.render('userdetailsedit',{title:'edit details',user:rows[0]});
    });
});
app.post('/aftereditsave',(req,res)=>{
    let data=[req.body.firstname,req.body.lastname,req.body.email,req.body.password,
        req.body.mobile,req.body.state,req.body.city,req.body.address1,req.body.address2,
        req.body.pin,req.body.slno];
    let sql="update Userdetails set first_name=?,last_name=?,email=?,password=?,mobile=?,state=?,city=?,address1=?,address2=?,pin=? where sl_no=?";
    connection.query(sql,data,(err,rows)=>{
        if(err)throw err;
        res.redirect('/userdetails');
    });
});
//for creditcard details
app.get('/creditcarddetails',(req,res)=>{
    let sql="select * from credit_card_detail";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        res.render('creditcarddetail',{title:'admincard details',user:rows})
    });
});
//for adminproducts detail
app.get('/adminproduct',(req,res)=>{
    let sql="select * from products";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        res.render('adminproduct',{title:'product details',user:rows});
    });
});
//for add admin details for add any products
app.get('/admin_add_productdetail',(req,res)=>{
    res.render('addproducts');
});
//for insert products through admin
app.post('/addadmin_data',static.single("image"),(req,res)=>{
    let data={product_name:req.body.productname,image:req.file.filename,product_details:req.body.productdetail,
    cetegory_name:req.body.cetegorydetail,price:req.body.price,ranking:req.body.ranking,current_status:req.body.currentstatus};
    let sql="insert into products set ?";
    connection.query(sql,data,(err,rows)=>{
        if(err)throw err;
        res.redirect('/adminproduct');
    });
});
//for delete from product page
app.get('/delete_admin_product/:sl_no',(req,res)=>{
    let sql="delete from products where sl_no=?";
    connection.query(sql,[req.params.sl_no],(err,rows)=>{
        if(err)throw err;
        res.redirect('/adminproduct');
    });
});
//for product edit page
app.get('/editadminproduct/:sl_no',static.single("image"),(req,res)=>{
    let sql="select * from products where sl_no=?";
    connection.query(sql,[req.params.sl_no],(err,rows)=>{
        if(err)throw err;
        res.render('product_edit',{title:'edit product',user:rows[0]});
    });
});
//after save the product details
app.post('/after_save_product',static.single("image"),(req,res)=>{
    if(req.file){
        var sql="update products set product_name=?,image=?,product_details=?,cetegory_name=?,price=?,ranking=?,current_status=? where sl_no=?"
        var data=[req.body.productname,req.file.filename,req.body.productdetail,req.body.cetegorydetail,req.body.price,req.body.ranking,req.body.currentstatus,req.body.slno];
    }else{
        var sql="update products set product_name=?,product_details=?,cetegory_name=?,price=?,ranking=?,current_status=? where sl_no=?"
        var data=[req.body.productname,req.body.productdetail,req.body.cetegorydetail,req.body.price,req.body.ranking,req.body.currentstatus,req.body.slno];
    }
    connection.query(sql,data,(err,rows)=>{
        if(err)throw err;
        res.redirect('/adminproduct');
    }); 
});
//for paymenttype in admin page
app.get('/paymenttype',(req,res)=>{
    let sql="select * from paymenttype";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        res.render('paymenttype',{title:'payment type',user:rows});
    });
});
//for fetch data from paymenttype
app.get('/cartproduct',static.single("image"),(req,res)=>{
    let sql="select * from cartitem";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        if(rows.length==0){
            res.send("<h1 style='text-align:center;color:blue;font-size:45px;'>You haven't any cart product</h1>");
        }
        res.render('cart_item_admin',{title:'cart product',user:rows});
    });
});
//for website start from here
app.get('/',(req,res)=>{
    res.render('login',{title:'user login'});                                                       
});
app.post('/succ',(req,res)=>{
    let data=[req.body.email_id,req.body.password];
    let sql="select email,password from Userdetails";
    connection.query(sql,data,(err,rows)=>{
        for(let i=0;i<rows.length;i++){
            if(err)throw err;
            if(data[0]===rows[i].email && data[1]===rows[i].password){
                res.render('./succ',{user:rows});
            }
        };
    });
});
app.get('/signup',(req,res)=>{
    res.render('login2',{title:'Sign up'})
});
//for signup data store to the database
app.post('/save',(req,res)=>{ 
    let sql="insert into Userdetails set ?";
    let data={first_name:req.body.firstname,last_name:req.body.lastname,email:req.body.email,password:req.body.password,
    mobile:req.body.mobile,state:req.body.state,city:req.body.city,address1:req.body.address1,address2:req.body.address2,
    pin:req.body.pin};
    let qry=connection.query(sql,data,(err,rows)=>{
        if(err)throw err;
        res.redirect('/');
    });
});
//home page
app.get('/home',(req,res)=>{
    let sql="select * from products where current_status='not available' ";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        res.render('home',{title:'home',user:rows});
    });
});
//cetegory page
app.get('/cetegory',(req,res)=>{
    let sql="select * from products order by sl_no desc limit 0,5";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        res.render('cetegory',{title:'procuct',user:rows});
    });
});
//data moved to cart page
app.get('/data/:sl_no',(req,res)=>{
    let sql='select sl_no,product_name,image,product_details,cetegory_name,price from products where sl_no=?';
    connection.query(sql,[req.params.sl_no],(err,rows)=>{
        if(err)throw err;
        res.render('cetegory2',{title:'cetegory',user:rows});
    });
});
app.get('/addcart/:image/:product_name/:product_details/:price',(req,res)=>{
    let sql="insert into cartitem set ?";
    let data={image:req.params.image,product_name:req.params.product_name,product_detail:req.params.product_details,price:req.params.price};
    connection.query(sql,data,(err,rows)=>{
        if(err)throw err;
        res.render('cart_itemsuccess',{title:'cart product'});
    });
});
//render to cart page
app.get('/showcart',(req,res)=>{
    let sql="select * from cartitem";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        if(rows.length == 0){
            res.render('cart',{title:'cart product'})
        }
        res.render('usercart',{title:'cart product',user:rows});
    });
});
//remove the cart product from cart page
app.get('/remove/:sl_no',(req,res)=>{
    let sql="delete from cartitem where sl_no=?";
    connection.query(sql,[req.params.sl_no],(err,rows)=>{
        if(err)throw err;
        res.redirect('/showcart');
    });
});
//render to payment page
app.get('/payment',(req,res)=>{
    res.render('payment',{title:'payment'});
});
//save the payment details into the database
app.post('/ordered',(req,res)=>{
    let sql="insert into credit_card_detail set ?";
    let data={name:req.body.name,credit_card_number:req.body.credit_number,card_exp_month:req.body.card_exp_month,card_exp_year:req.body.card_exp_year,cvv:req.body.cvv};
    connection.query(sql,data,(err,rows)=>{
        res.render('transation',{title:'transation',user:rows});
    });
});
//order confirm page
app.get('/order_confermed',(req,res)=>{
    let sql="select * from credit_card_detail order by sl_no desc limit 0,1;";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        let x = Math.floor((Math.random() * 100000000) + 1);
        let y = Math.floor((Math.random() * 10000000000000000) + 1);
        let d = new Date();
        let e = new Date(2021,10,(d.getDate()+7));
        res.render('conferm',{title:'order confermed',user:rows,userid:x,orderid:y,todaydate:d.toDateString(),orderdate:e.toDateString()});
    });
});
//for service page
app.get('/services',(req,res)=>{
    res.render('service')
});
app.get('/totalorder/:page',(req,res)=>{
    let no_of_post=3;
    let page=Number(req.params.page);
    if('page=!NaN'){
        page=Number(req.params.page);
    }
    let sql="select * from credit_card_detail";
    connection.query(sql,(err,rows)=>{
        let blogs=rows.slice((page-1)*no_of_post,page*no_of_post);
        if(page > 1){
            prev=page-1;
        }else{
            prev=NaN;
        }
        if(page < Math.ceil(rows.length/no_of_post)){
            next=page+1;
        }else{
            next=NaN;
        }
        if(err)throw err;
        res.render('orderdetails',{title:'order details',blog:blogs,prev:prev,next:next});
    });
});
app.get('/refaund',(req,res)=>{
    res.render('refaund');
});
app.post('/refaund_item',(req,res)=>{
    let data={name:req.body.name,product_name:req.body.productname,resion_of_return:req.body.return};
    let sql="insert into returntable set ?";
    connection.query(sql,data,(err,rows)=>{
        if(err)throw err;
        res.redirect('/home');
    });
});
//foe top brands page
app.get('/topbrands',(req,res)=>{
    let sql="SELECT * FROM products ORDER BY sl_no LIMIT 0,4";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        res.render('topbrands',{title:'top brands',user:rows});
    });
});
//for render to cart page
app.get('/cart',(req,res)=>{
    let sql="select * from cartitem";
    connection.query(sql,(err,rows)=>{
        if(err)throw err;
        if(rows.length == 0){
            res.render('cart');
        }
        res.render('usercart',{title:'cart product',user:rows});
    });
});
