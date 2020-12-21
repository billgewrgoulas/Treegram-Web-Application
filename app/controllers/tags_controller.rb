class TagsController<ActionController::Base
  


  def create

    if Tag.where(user_id: params[:tag][:user_id] , photo_id: params[:tag][:photo_id]).exists?(conditions = :none)
    
       render json: {exists: true}
       return
       
    end
     
    
    @user = User.find(params[:tag][:user_id])
    @photo = Photo.find(params[:tag][:photo_id])
   
    x = @photo.tagcount
    
    @photo.update(tagcount: x + 1)
    

    flash[:notice] = x     
    @tag = Tag.create({user_id: params[:tag][:user_id], photo_id: params[:tag][:photo_id]})
    
    render json: @tag
    return
     
  end
end
