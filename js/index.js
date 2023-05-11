window.onload=function(){
    const vm =new Vue({
        el:'#box',
        data:{
            list:[]
        },
        methods:{
            getData(){
                var config={
                    method:"GET",
                    redirect:"follow"
                }
                fetch('https://script.google.com/macros/s/AKfycbwRHDR3lYNevH4uuRUFenjYj4OHDbXAJ1k-KutGDBGkSknlSEJ7Fg8VxbPEf70lEQt6fA/exec',config)
                .then(function(resp){
                    return resp.json();
                })
                .then(function(resp){
                    if(resp.length>1) vm.list=resp;
                    else vm.update();
                    setInterval(function(){
                        vm.update();
                    },10000);
                });
            },
            update(){
                var config={
                    method:"GET",
                    redirect:"follow"
                }
                fetch('https://script.google.com/macros/s/AKfycbwRHDR3lYNevH4uuRUFenjYj4OHDbXAJ1k-KutGDBGkSknlSEJ7Fg8VxbPEf70lEQt6fA/exec',config)
                .then(function(resp){
                    return resp.json();
                })
                .then(function(resp){
                    if(resp.length>1) vm.list=resp;
                });
            }
        }
    });
    vm.getData();
}