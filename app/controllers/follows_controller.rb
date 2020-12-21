class FollowsController<ActionController::Base
  
  def create

    exists = Follow.exists?(follower: session[:user_id], followed: params[:f_id])
       
    if exists
      follow = Follow.find_by(follower: session[:user_id], followed: params[:f_id])
      render json: @follow
      return
    end
     
    @follow = Follow.create({follower: session[:user_id] , followed: params[:f_id]})
    flash[:notice] = "new follower"
    u = User.find(params[:f_id])
    render json: {email: u.email}
    return

  end
   
  def destroy

    @follow = Follow.find_by(follower: session[:user_id], followed: params[:id])
    @follow.destroy
    u = User.find(params[:id])
    render json: {email: u.email}
    return

  end    
end