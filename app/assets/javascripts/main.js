

$(document).ready(function(){

    // a work around to the turbolinks issue
    // after refresh the script will run properly
    //$(document).on("turbolinks:load",function(){ would also work

    $(window).on("popstate", function() {
        location.reload(true);
    });

    var flag = true;
    var mouseIn;
    $(" .user").on("click", function(e) {
        if (flag || flag2) {
            $(" .profile-dropdown").show();
        } else {
            $(" .profile-dropdown").hide();
        }
        flag = !flag;
    });
    
    $(" .profile-dropdown").hover(function(e){ 
        mouseIn=true;
    }, function(e){ 
        mouseIn=false; 
    });
           //should work now , flag == false means user has been 
           // clicked and dropdown is visible if clickout then hide also set flag = !flag
    $("html").mouseup(function(){ 
        if(!mouseIn &&!flag){
	   $(" .profile-dropdown").hide();
           flag = !flag;
	} 
    });


    $(window).resize(function() {

        if ($(window).width() > 520) {
            $("body").removeClass("foggy");
            $(" .options").hide();
        }
    });

    /*$(" .image-container").hover(function(event) {
        var kids = $(this).children();
        $(kids[0]).stop().toggle(430, function() {
            //all good
        });
        $(kids[2]).stop().toggle(430, function() {
            //all good
        });
    })*/

    $(" .js-tag").on("click", function() {


        var id = $(this).attr('id');
        var email = $(this).html();
        var form = $(this).parent();
        var kids = $(form).children();
        $(kids[3]).val(id);
        var photoId = "#" + $(kids[2]).val();

        //$(form).submit();
        //no need to reload the page when a new tag is created

        $.ajax({
            url: $(form).attr("action"),
            dataType: 'Json',
            type: 'POST',
            data: $(form).serialize(),
            success: function(data) {
		
  		// server side validation
                if(data.exists){
		    confirm("This user is already tagged.");
                    return;
                }

                //update corresponding tag

                var tag = $(photoId + "tag").children()[1];
                tag.dataset.tagCount++;

                //update tagged users

                $(photoId + "tu").append("<div class = 'dropdown-item' >" + email + "</div>");
            },
            error: function() {
                confirm("panic!!!!!!");
            },

        });
    })

    $(" .js-remove").on("click" , function(event){

        var container = $(this).parent().parent();
        var ids = $(container).attr("id").split("-");

        $.ajax({

           url: "/users/"+ids[0]+"/photos/" + ids[1],
           dataType: "Json",
           type: "DELETE",
           data: { },
           success: function(response){
             if(response.failed){
                confirm("This photo belongs to user: " + response.email
                         + ",so u cant delete it");
             }
             else{
                $(container).toggle(600, function(){
                   $(this).remove(); 
                   //confirm("photo was succesfully deleted");
                });
             }
           },
           error: function() {
             confirm("panic!!!!!!");
           },
        })
    })
})

function toggler() {
    $(" .options").toggle(250, function(event) {
        if ($(" .options").is(":visible")) {
            $("body").addClass('foggy');
        } else {
            $("body").removeClass('foggy');
        }
    });
}


function homePage(id){
    window.location.href = "/users/" + id;
}










