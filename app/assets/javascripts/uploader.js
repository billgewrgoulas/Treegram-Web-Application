
$(document).on("turbolinks:load",function(){
     $(document).ready(function(){

	 $("#img-input").on("change" , function(){
             uploaded(this);
	 });
            //had some recursion problems so better check
         $(".img-container").on("click" , function(event){
             if ($(event.target).is(".img-container") || $(event.target).is("#drop-zone")) {
        	$("#img-input").trigger("click"); 
    	     }	
	 });
    	    
    });
});


function uploaded(event){

     var file = event.files[0];

     if(file){
         $("#img-name").html("Your image: " + file.name);
     	 $("#title").val(file.name);
         var reader = new FileReader();
         reader.onload = function(e){ 
            $(".img-container").css("background-image", "url(" + e.target.result + ")");
         }
         reader.readAsDataURL(file);
     }
}

