var $delete_user = function(){
    var $username = $(this).attr('name')
    var $url = "/delete/user/"+$username
    if($url=="/delete/user/admin"){
        alert("Admin can't delete");
    }else if( confirm("Are you sure delete this user?") ){
        $.ajax({
            url: $url,
            dataType: 'json',
            success: function(data){
                if(data['status'] == 'success'){
                    $("."+$username).remove();
                }else{
                    alert(data['message'])
                }
            }
        });
    }
}

var $adduser= function(){
    var $link = "/add/user";
    $.ajax({
        url: $link,
        dataType: 'json',
        success: function(data){
            if(data['status'] == 'success'){
                var $maindiv = $('#maindiv');
                $maindiv.empty();
                $maindiv.append(' <div class="login-panel panel panel-default"></div>');

                var $login_panel = $maindiv.children('div').first();
                $login_panel.append('<div class="panel-heading"> <h3 class="panel-title">Please Enter User Information </h3>  </div>');
                $login_panel.append('<div class="add_user panel-body"></div>');

                var $panel_body =$('.add_user');
                $panel_body.append('<form role="form" method="post" action="/add/user/handler">');

                var $form = $panel_body.children('form').first();
                $form.append('<fieldset></fieldset>');

                var $fieldset= $form.children('fieldset').first();
                $fieldset.append('<div class="form-group"> <input class="form-control" placeholder="Username" name="username"  autofocus> </div>');
                $fieldset.append('<div class="form-group"> <input class="form-control" placeholder="Password" name="password" type="password" value=""> </div>');
                $fieldset.append('<div class="form-group"> <select class="form-control" name="usertype"> <option selected>Please select a user type</option> <option>Admin</option> <option>Standart User</option> <option>Only Log</option> <option>Read Only</option> </select> </div>');
                $fieldset.append('<button class="btn btn-lg btn-success btn-block"> Save </button>');
            }else{
                alert("Only admin can add user");
            }
        }
    });
}

var $showdeluserpage = function(){
    var $link = "/delete/user";
    $.ajax({
        url: $link,
        dataType: 'json',
        success: function(data){
            if(data['status'] == "success"){
                var $maindiv = $('#maindiv');
                $maindiv.empty();
                $maindiv.append('<div class="panel-body"></div>');

                var $panel = $maindiv.children('div').first();
                $panel.append('<div class="table-responsive"></div>');

                var $tablediv = $panel.children('div').first();
                $tablediv.append('<table class="table table-striped table-bordered table-hover" id="dataTables-example">');

                var $table = $tablediv.children('table').first();
                $table.append('<tr><th>Username</th><th>Usertype</th><th></th></tr>');

                for(var i=1; i<data['names'].length; i++){
                    $table.append('<tr class="'+data['names'][i]+'"></tr>');

                    var $maintr = $table.find('tr').last();
                    $maintr.append('<td>'+data['names'][i]+'</td> <td>'+data['types'][i]+'</td><td><button name="'+data['names'][i]+'" class="glyphicon glyphicon-trash btn btn-sm btn-success btn-block delete"></button></td>');

                    var $delbtn =$maintr.find('button').last();
                    $delbtn.click($delete_user);
                }
            }else{
                alert("Only admin can delete user");
            }
        } 
    });
}

var $changepassword = function(){
    $username = $(this).attr('name');
    $link = "/change/password/"+$username;
    $.ajax({
        url: $link,
        dataType: 'json',
        success: function(data){
            if(data['status'] == "success"){
                var $maindiv = $('#maindiv');
                $maindiv.empty();
                $maindiv.append('<div class="login-panel panel panel-default"></div>'); 

                var $panel= $maindiv.children('div').first();
                $panel.append('<div class="panel-heading"><h3 class="panel-title">Change Password</h3></div>');
                $panel.append('<div class="panel-body"><form method="post" action="/change/password/'+$username+'/handler"><fieldset></fieldset></form></div>');

                var $fieldset =$maindiv.find('fieldset');
                $fieldset.append('<div class="form-group"><input class="form-control" placeholder="Old password" name="old" type="password" autofocus></div>');
                $fieldset.append('<div class="form-group"><input class="form-control" placeholder="New Password" name="new" type="password"></div>');
                $fieldset.append('<div class="form-group"><input class="form-control" placeholder="Confirm Password" name="confirm" type="password"></div>');
                $fieldset.append('<input name="'+$username+'" class="btn btn-lg btn-success btn-block" value="Save">');

                var $btn = $panel.find('input').last();
                $btn.click($passwordhandler);
            }else{
                alert ("Unsuccesfull");
            }
        }
    }); 
}

var $passwordhandler = function(){
    var $username=$(this).attr('name');
    var $url = "/change/password/"+$username+"/handler";
    $.ajax({
        url: $url,
        dataType: 'json',
        type: 'post',
        data: $(this).parent().parent().serialize(),
        success: function(data){
            if(data['status']=="success"){
                alert("Password changed");
            }else{
                alert(data['message']);
            }
        }
   });
}


var $buttonactions = function(){
    var $tr = $(this).parent().parent();
    var $td = $tr.children('td').first();
    var $url = $(this).attr('name');
    $.ajax({
        url: $url,
        dataType: 'json',
        success: function(data){
            if(data['status'] == "Success"){
                if (data['data']['pid'] == 0 ){ $td.html("-"); }else{ $td.html(data['data']['pid']); }
                    
                    $td = $td.next();
                    $td.html(data['data']['name']);

                    $td = $td.next();
                    $td.html(data['data']['group']);

                    $td = $td.next();
                    $td.html(data['data']['description'].substring(17,24));

                    $td = $td.next();
                    if( data['data']['state']==0 || data['data']['state']==40 || data['data']['state']==100 || data['data']['state']==200 ){
                        $td.attr('class', "alert alert-danger");
                    }else if( data['data']['state']==10 || data['data']['state']==20 ){
                        $td.attr('class', "alert alert-success");
                    }else{
                        $td.attr('class', "alert alert-warning");
                    }
                    $td.html(data['data']['statename']);

                    $td = $td.next();
                    if( data['data']['state']==20){
                        $restart = $td.children('button').first();
                        $restart.attr('class',"btn btn-primary btn-block");
                        $name = "/node/"+data['nodename'] + "/process/" + data['data']['group'] + ":" + data['data']['name'] + "/restart";
                        $restart.attr('name',$name );
                        $restart.attr('value',"Restart");
                        $restart.html("Restart");
                        
                        $td = $td.next();
                        $stop = $td.children('button').first();
                        $stop.attr('class',"btn btn-primary btn-block");
                        $name2 = "/node/"+data['nodename'] + "/process/" + data['data']['group'] + ":" + data['data']['name'] + "/stop";
                        $stop.attr('name',$name2 );
                        $stop.attr('value',"Stop");
                        $stop.html("Stop");
                    }else if(data['data']['state']==0){
                        $start = $td.children('button');
                        $start.attr('class',"btn btn-primary btn-block");
                        $name = "/node/"+data['nodename'] + "/process/" + data['data']['group'] + ":" + data['data']['name'] + "/start";
                        $start.attr('name',$name );
                        $start.attr('value',"Start");
                        $start.html("Start");
                        $td = $td.next();
                        $stop = $td.children('button').first();
                        $stop.attr('class',"btn btn-primary btn-block");
                        $stop.attr('class',"btn btn-primary btn-block disabled");
                        $stop.attr('name'," ");
                        $stop.attr('value',"Stop");
                    }
                }else if(data['status'] == "error2"){
                    alert(data['message']);
                }else{
                    alert("Error:"+data[message]+
                          "Code:"+data['code']+
                          "Payload:"+data[code]);
                }
        }
    });
};



var $selectnode = function(){
    var $maindiv = $("#maindiv");
    $maindiv.empty();

    var $logdiv = $("#dialog");
    $logdiv.empty();
    var $checkbox = $(this).children('input').first();
    var ischecked = $checkbox.is(":checked");

    if(ischecked){
        $checkbox.prop("checked", false);
    }else{
        $checkbox.prop("checked", true);
    }
    $( "input:checked" ).each(function() { 
        var nodename = $(this).attr('value');
        var $url = "/node/"+nodename
        $.ajax({
            url: $url,
            dataType: 'json',
            success: function(result){
                $maindiv.append('<div class="panel panel-primary panel-custom" id="panel'+nodename+'"></div>');
                var $panel = $("#panel"+nodename);
                $panel.append('<div class="panel-heading"><span class="glyphicon glyphicon-th-list"></span> '+ nodename +'</div>');
                $panel.append('<table class="table table-bordered" id="table'+nodename+'" ></table>');
                var $table = $("#table"+nodename);
                $table = $table.append('<tr class="active"> <th>Pid</th> <th>Name</th> <th>Group</th> <th>Uptime</th> <th>State name</th> <th></th> <th></th> </tr>');
                for(var $counter = 0; $counter < result['process_info'].length; $counter++){
                    $table = $table.append('<tr class="process_info" id="'+nodename+$counter+'"></tr>');
                    var $tr_p = $('#'+nodename+$counter);

                    //pid
                    if( result['process_info'][$counter]['pid'] == 0 ){
                        $tr_p.append('<td> - </td>');
                    }else{
                        $tr_p.append('<td>'+ result['process_info'][$counter]['pid'] + '</td>');
                    }

                   //name
                   $tr_p.append('<td>'+ result['process_info'][$counter]['name'] + '</td>')

                   //group
                   $tr_p.append('<td>'+ result['process_info'][$counter]['group'] + '</td>');

                   //uptime
                   var $uptime = result['process_info'][$counter]['description'].substring(17,24)
                   $tr_p.append('<td>'+ $uptime + '</td>');

                   //statename
                   var $state = result['process_info'][$counter]['state'];
                   if( $state==0 || $state==40 || $state==100 || $state==200 ){
                       $tr_p.append('<td class="alert alert-danger">'+ result['process_info'][$counter]['statename'] + '</td>');
                   }else if($state==10 || $state==20){
                       $tr_p.append('<td class="alert alert-success">'+ result['process_info'][$counter]['statename'] + '</td>');
                   }else{
                       $tr_p.append('<td class="alert alert-warning">'+ result['process_info'][$counter]['statename'] + '</td>');
                   }

                   //buttons
                   if( $state==20 ){
                       $tr_p.append('<td></td>');
                       $td_p = $tr_p.children('td').last();
                       $td_p.append('<button class="btn btn-primary btn-block act" name="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/restart" value="Restart">Restart</button>');
                       var $btn_restart = $td_p.children('button').first();
                       $btn_restart.click($buttonactions);

                       $tr_p.append('<td></td>');
                       var $td_p = $tr_p.children('td').last();
                       $td_p.append('<button class="btn btn-primary btn-block act" name="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/stop" value="Stop">Stop</button>');
                       var $btn_stop = $td_p.children('button').first();
                       $btn_stop.click($buttonactions);
                    }else if($state==0){
                       $tr_p.append('<td></td>');
                       var $td_p = $tr_p.children('td').last();;
                       $td_p.append('<button class="btn btn-primary btn-block act" name="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/start" value="Start">Start</button>');
                       var $btn_restart = $td_p.children('button').first();
                       $btn_restart.click($buttonactions);

                       $tr_p.append('<td></td>');
                       var $td_p = $tr_p.children('td').last();
                       $td_p.append('<button class="btn btn-primary btn-block disabled act" value="Stop">Stop</button>');
                       var $btn_stop = $td_p.children('button').first();
                       $btn_stop.click($buttonactions);
                    }
                    //Readlog
                    $tr_p.append('<td><a class="btn btn-primary btn-block act" nodename="'+nodename+'" processgroup="'+result['process_info'][$counter]['group']+'" processname="'+result['process_info'][$counter]['name']+'" url="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/readlog"> Readlog </a></td>');
                    var $readlog = $tr_p.children('td').last().children('a').first();

                    $readlog.click(function(){
                        var url=$(this).attr('url');
                        var nodename=$(this).attr('nodename');
                        var processname=$(this).attr('processname');
                        var processgroup=$(this).attr('processgroup');
                        var classname = nodename+"_"+processgroup+"_"+processname
                        var $dia = $("."+classname);
                        var timer;

                        if($dia.length==0){
                            $logdiv.append('<div class="'+classname+'"></div>');
                            $dia = $("."+classname);
                        }
                        $.ajax({
                            url: url,
                            dataType: 'json',
                            success: function(log){
                                $dia.html('<p>'+log['log']+'</p>');
                            }
                        });
                        $dia.dialog({
                            open: function(){
                                timer = setInterval(function () {
                                    $.ajax({
                                        url: url,
                                        dataType: 'json',
                                        success: function(log){
                                            $dia.html('<p>'+log['log']+'</p>');
                                        }
                                    });
                                },1000);
                            },
                            close: function(){
                                console.log("kapandiii");
                                clearInterval(timer);
                            },
                            title: classname,
                            maxWidth: 600,
                            maxHeight: 500,
                            show: {
                                effect: "blind",
                                duration: 500
                            },
                            hide: {
                                effect: "clip",
                                duration: 500,
                            }
                        });
                    });
                }
            }  
        });
    });
}

var $showallprocess = function(){
    var $maindiv = $("#maindiv");
    $maindiv.empty();

    var $logdiv = $("#dialog");
    $logdiv.empty();

    var $url = "/node/name/list"
    $.ajax({
        url: $url,
        dataType: 'json',
        success: function(nodenames){
            nodenames['node_name_list'].forEach(function(nodename){
            var $nodeurl = "/node/"+nodename
            $.ajax({
                url: $nodeurl,
                dataType: 'json',
                success: function(result){
                    $maindiv.append('<div class="panel panel-primary panel-custom" id="panel'+nodename+'"></div>');
                    var $panel = $("#panel"+nodename);
                    $panel.append('<div class="panel-heading"><span class="glyphicon glyphicon-th-list"></span> '+ nodename +'</div>');
                    $panel.append('<table class="table table-bordered" id="table'+nodename+'" ></table>');
                    var $table = $("#table"+nodename);
                    $table = $table.append('<tr class="active"> <th>Pid</th> <th>Name</th> <th>Group</th> <th>Uptime</th> <th>State name</th> <th></th> <th></th> </tr>');
                    for (var $counter = 0; $counter < result['process_info'].length; $counter++){
                        $table = $table.append('<tr class="process_info" id="'+nodename+$counter+'"></tr>');
                        var $tr_p = $('#'+nodename+$counter);
                       
                        //pid
                        if( result['process_info'][$counter]['pid'] == 0 ){
                            $tr_p.append('<td> - </td>');
                        }else{
                            $tr_p.append('<td>'+ result['process_info'][$counter]['pid'] + '</td>');
                        }

                        //name
                        $tr_p.append('<td>'+ result['process_info'][$counter]['name'] + '</td>')

                        //group
                        $tr_p.append('<td>'+ result['process_info'][$counter]['group'] + '</td>');

                        //uptime
                        var $uptime = result['process_info'][$counter]['description'].substring(17,25)
                        $tr_p.append('<td>'+ $uptime + '</td>');
 
                        //statename
                        var $state = result['process_info'][$counter]['state'];
                        if( $state==0 || $state==40 || $state==100 || $state==200 ){
                            $tr_p.append('<td class="alert alert-danger">'+ result['process_info'][$counter]['statename'] + '</td>');
                        }else if($state==10 || $state==20){
                            $tr_p.append('<td class="alert alert-success">'+ result['process_info'][$counter]['statename'] + '</td>');
                        }else{
                            $tr_p.append('<td class="alert alert-warning">'+ result['process_info'][$counter]['statename'] + '</td>');
                        }

                        //buttons
                        if( $state==20 ){
                            $tr_p.append('<td></td>');
                            var $td_p = $tr_p.children('td').last();
                            $td_p.append('<button class="btn btn-primary btn-block act" name="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/restart" value="Restart">Restart</button>');
                            var $btn_restart = $td_p.children('button').first();
                            $btn_restart.click($buttonactions);

                            $tr_p.append('<td></td>');
                            var $td_p = $tr_p.children('td').last();
                            $td_p.append('<button class="btn btn-primary btn-block act" name="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/stop" value="Stop">Stop</button>');
                            var $btn_stop = $td_p.children('button').first();
                            $btn_stop.click($buttonactions);
                        }else if($state==0){
                            $tr_p.append('<td></td>');
                            var $td_p = $tr_p.children('td').last();;
                            $td_p.append('<button class="btn btn-primary btn-block act" name="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/start" value="Start">Start</button>');
                            var $btn_restart = $td_p.children('button').first();
                            $btn_restart.click($buttonactions);
                            
                            $tr_p.append('<td></td>');
                            var $td_p = $tr_p.children('td').last();
                            $td_p.append('<button class="btn btn-primary btn-block disabled act" value="Stop">Stop</button>');
                            var $btn_stop = $td_p.children('button').first();
                            $btn_stop.click($buttonactions);
                        }
                        //Readlog
                        $tr_p.append('<td><a class="btn btn-primary btn-block act" nodename="'+nodename+'" processgroup="'+result['process_info'][$counter]['group']+'" processname="'+result['process_info'][$counter]['name']+'" url="/node/'+nodename+'/process/'+result['process_info'][$counter]['group']+':'+result['process_info'][$counter]['name']+'/readlog"> Readlog </a></td>');
                        var $readlog = $tr_p.children('td').last().children('a').first();
                        $readlog.click(function(){
                            var url=$(this).attr('url');
                            var nodename=$(this).attr('nodename');
                            var processname=$(this).attr('processname');
                            var processgroup=$(this).attr('processgroup');
                            var classname = nodename+"_"+processgroup+"_"+processname
                            var $dia = $("."+classname);
                            var timer;
                                       
                            if($dia.length==0){
                                $logdiv.append('<div class="'+classname+'"></div>');
                                $dia = $("."+classname);
                            }
                            $.ajax({
                                url: url,
                                dataType: 'json',
                                success: function(log){
                                    $dia.html('<p>'+log['log']+'</p>');
                                }

                            });
                            $dia.dialog({
                                open: function(){
                                    timer = setInterval(function () {
                                        $.ajax({
                                            url: url,
                                            dataType: 'json',
                                            success: function(log){
                                                $dia.html('<p>'+log['log']+'</p>');
                                            }
                                        });
                                    },1000);
                                },
                                close: function(){
                                    clearInterval(timer);
                                },
                                title: classname,
                                maxWidth: 600,
                                maxHeight: 500,
                                show: {
                                    effect: "blind",
                                    duration: 500
                                },
                                hide: {
                                    effect: "clip",
                                    duration: 500,
                                }
                              });
                            });
                        }
                    }
                });
            });
        }
    });
}

$( document ).ready(function() {
    $(".showall").click($showallprocess);
    $(".ajax2").click($selectnode);
    $(".act").click($buttonactions);
    $(".adduser").click($adduser);
    $(".deluser").click($showdeluserpage);
    $(".changepassword").click($changepassword);
});
