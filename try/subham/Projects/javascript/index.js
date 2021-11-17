function google(){
    window.location.assign("https://www.google.com");
}
function twitter(){
    window.location.assign("https://www.twitter.com");
}
function instagram(){
    window.location.assign("https://www.instagram.com");
}
function status(){
    window.location.assign("https://www.bootstrap.com");
}
function targetbutton1(){
    window.location.href="category2.html";
}
function addtocartjvl(){
    window.location.href="usercartproduct.html";
}
function adddata(){
    window.location.href="adddata.html";
}
function map(){
    window.location.assign('https://www.google.co.in/maps/@20.9479402,86.3680859,15z');
}
function myfunction(){
    let data1=document.getElementById('firstname').value;
    let data2=document.getElementById('lastname').value;
    let data3=document.getElementById('city').value;
    let data4=document.getElementById('email').value;
    let data5=document.getElementById('mobile').value;
    document.getElementById('fullname').innerHTML=data1+' '+data2;
    document.getElementById('city').innerHTML=data3;
    document.getElementById('email').innerHTML=data4;
    document.getElementById('mobile').innerHTML=data5;
}
