
//wait for page to load  
$(document).ready(function(){
   
     //fix issue with turbolinks
    $(document).on("turbolinks:load",function(){


        $(" .js-hover").on("click",function(event){

            var uidI = $(this).parent().siblings()[0];
        
            if($(uidI).hasClass("fa-times")){
                $(uidI).addClass("fa-check");
                $(uidI).removeClass("fa-times");
                $(uidI).css("color" , "green");
                newFollower(this);
             }
            else{
                $(uidI).removeClass("fa-check");
                $(uidI).addClass("fa-times");
                $(uidI).css("color" , "red");
	        unFollow(this);
            }
        });
    });
});
function newFollower(event){

    var id = {
		"f_id" : $(event).attr("id") 
	     };
    //var data = [{},{}];

    $.ajax({

        cache: "false",
        type: "POST",
        datatype: "Json",
        url: "/follows",
        data: id,

        success:function(data){
            confirm("You are now following " + data.email);
        },
        error:function(){
            confirm("panic beast emerges!!!")
        }
    })
}
function unFollow(event){

    $.ajax({

        cache: "false",
        type: "DELETE",
        datatype: "Json",
        url: "/follows/" + $(event).attr("id"),
        data: {},
        success:function(data){
            confirm("You unfollowed user " + data.email + " :( ");
        },
        error:function(){
            confirm("panic!!!")
        }
    })
}








