function spin_the_wheel(){
    
    var x = 1024;
    var y = 9999;

    var deg = Math.floor(Math.random() * (x -y)) + y;

    document.getElementById('box').style.transform = "rotate(" + deg + "deg)";

    var element = document.getElementById('mainbox');
    element.classList.remove('animate');
    setTimeout(function(){
        element.classList.add('animate');

        var inputVal = document.getElementById("span2").name;
        alert(inputVal);
    }, 5000);
}