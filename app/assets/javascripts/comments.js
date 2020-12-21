

//fix issue with turbolinks
$(document).on("turbolinks:load",function(){

    $(".cool-new-comment-box").focus(function(event){
        $("#text").css({"width": "500px", "height": "100px"})
        $("#css-post").show();
        $("#css-cancel").show();
    });

    $("#css-cancel").on("click" , function(){
	$("#text").css({"width": "400px", "height": "47px"})
        $("#css-post").hide();
        $("#css-cancel").hide();
    })

})

function newComment(){

    if($(" .cool-new-comment-box").val() == ""){
        confrim("u must write something");
        return;
    }

    $.ajax({
        url: $("#super-form").attr("action"),
        dataType: 'Json',
        type: 'POST',
        data: $("#super-form").serialize(),
        success: function(data){
	    myCallback(data.text,data.email,data.avatar);
	},
        error: function() {
            confirm("panic monster!!!!!!");
        },

    });

}
function myCallback(text,email,avatar){
    
    if(avatar == "/avatars/thumb/missing.png"){
        avatar = "/system/users/avatars/uicon.jpg";
    }

    $(" .cool-new-comment-box").val("");

    var newComment = `
        <div class="lots-of-divs">
            <img src = ${avatar} class="rounded-circle" style="width: 40px; height:40px;margin-right:3px;">
            <div class="comment">
                <b>${email} said: </b>
                </br>
                <div class="comment-body">
                    <p>
                        ${text}
                    </p>
                </div>
            </div>
        </div>
    `;

    $(" .comments-list").prepend(newComment).fadeIn("slow");

}





