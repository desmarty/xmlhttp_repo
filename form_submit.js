function form_submit(form_name, option)
    {
    var reg_form = document.getElementById(form_name);
    
    if(document.getElementById('return_msg') != undefined)
        {
        var return_msg_div = document.getElementById('return_msg');
        if(return_msg_div != null) 
            return_msg_div.innerHTML = '<span>Please Wait...</span>'+
                                       '<span class="spin" style="display: inline-block; font-size: 30px; color: #CDABCA;">'+
                                            '&#8886;'+
                                       '</span>';
        }
    if(document.getElementById('submit') != undefined)
        {
        var submit_btn = document.getElementById('submit');
        submit_btn.setAttribute('disabled', 'true');
        }
        
    var total_inputs = 0;
    var total_textarea = 0;
    var total_select = 0;

    //contact form data setting
    if(reg_form.getElementsByTagName('input') != undefined)
        {
        var reg_inputs = reg_form.getElementsByTagName('input');
        total_inputs = reg_inputs.length;
        }
    if(reg_form.getElementsByTagName('textarea') != undefined)
        {
        var reg_textarea = reg_form.getElementsByTagName('textarea');
        total_textarea = reg_textarea.length;
        }
    if(reg_form.getElementsByTagName('select') != undefined)
        {
        var reg_select = reg_form.getElementsByTagName('select');
        total_select = reg_select.length;
        }
        
    var form_data = new FormData();
    
    if(option != undefined) form_data.append('option', option);
    else form_data.append('option' , form_name);

    //alert(form_name);
        
    for(i=0; i<total_inputs; i++)
        {
        var input_type = reg_inputs[i].type;
        var input_name = reg_inputs[i].name;
        var input_value = reg_inputs[i].value;

        if(input_type == 'radio')
            {
            if(reg_inputs[i].checked == true)
                {
                form_data.append(input_name , input_value);
                }
            }
            
        else if(input_type == 'checkbox')
            {
            if(reg_inputs[i].checked == true)
                {
                form_data.append(input_name , input_value);    
                }
            }
            
        else if(input_type == 'file' && reg_inputs[i].multiple != true)
            {
            var files = reg_inputs[i].files;
            
            if(files.multiple != true)
                {
                var file = files[0];
                if(file != undefined) 
                    {
                    form_data.append(input_name+'_chosen' , 'yes');
                    form_data.append(input_name, file, file.name);
                    }
                else form_data.append(input_name+'_chosen', 'no');
                }
                
            if(reg_inputs[i].checked == true)
                {
                form_data.append(input_name , input_value);    
                }
            }

        else form_data.append(input_name , input_value);    
        }
        
    for(i=0; i<total_textarea; i++)
        {
        var textarea_name = reg_textarea[i].id;
        var textarea_value = reg_textarea[i].value;

        form_data.append(textarea_name , textarea_value);    
        }
        
    for(i=0; i<total_select; i++)
        {
        var select_name = reg_select[i].id;
        var select_value = document.getElementById(select_name).value;
        form_data.append(select_name , select_value);    
        }
    
    if(typeof form_timeout !== "undefined") {clearTimeout(form_timeout);}
        
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = 
                        function()
                            {
                            if (this.readyState == 4 && this.status == 200)
                                {
                                try{
                                    var response_msg = JSON.parse(xhttp.responseText);
                                    
                                    if(response_msg['success'] == true)
                                        {
                                        return_msg_div.innerHTML = '<p style="background-color: #159515; color: white; padding:5px;">'+response_msg['message']+'</p>';
                                        if(response_msg['type'] == 'refresh_page')
                                            {
                                            form_timeout = setTimeout(function(){window.location.reload();}, 3000);
                                            }
                                        else if(response_msg['type'] == 'refresh_modal')
                                            {
                                            }
                                        else if(response_msg['type'] == 'refresh_div')
                                            {
                                            }
                                        else if(response_msg['type'] == 'redirect')
                                            {
                                            form_timeout = setTimeout(function(){window.location = response_msg['path'];}, 3000);
                                            }
                                        else if(response_msg['type'] == 'message')
                                            {
                                            form_timeout = setTimeout(function(){return_msg_div.innerHTML="";}, 10000);
                                            }
                                        }
                                    else if(response_msg['success'] == false)
                                        {
                                        return_msg_div.innerHTML = '<p style="background-color: #bf1717; color: white; padding:5px;">'+response_msg['message']+'</p>';

                                        if(response_msg['type'] == 'message')
                                            {
                                            submit_btn.removeAttribute('disabled');
                                            form_timeout = setTimeout(function(){return_msg_div.innerHTML="";}, 8000);
                                            }
                                        }    
                                    }
                                catch(err)
                                    {
                                    return_msg_div.innerHTML = '<p style="background-color: #bf1717; color: white; padding:5px;">Sorry.. Something really bad happened now. Page will be reloaded soon. Please wait.. Or you can reload manually, if it takes much more time.</p>';
                                    submit_btn.removeAttribute('disabled');
                                    form_timeout = setTimeout(function(){window.location.reload();}, 5000);
                                    }
                                
                                }
                            else if(this.status == 400 || this.status == 404)
                                {
                                }
                            };
        
    xhttp.open("POST", "php_extensions/http_form_modules.php", true);
    xhttp.send(form_data);
    }
