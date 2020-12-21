class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    @user.valid?
    if !@user.is_email?
      flash[:alert] = "Input a properly formatted email."
      redirect_to :back
    elsif @user.errors.messages[:email] != nil
      flash[:notice]= "That email " + @user.errors.messages[:email].first
      redirect_to :back
    elsif @user.save
      flash[:notice]= "Signup successful. Welcome to the site!"
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      flash[:alert] = "There was a problem creating your account. Please try again."
      redirect_to :back
    end
  end

  def new
  end
  
  def follow
  end

  def index 
    @users = User.where.not(id: session[:user_id])
    @user = User.find(session[:user_id])
  end

  def show

    @users = User.all
    @user = User.find(params[:id])

    #ids of the users this user follows
    fids = Follow.where(follower: params[:id]).select("followed")
   
    #users that this user follows
    @usersF = User.where(id: fids)
    
    #this will be the data transfer object model that we 
    # will pass to the view
    @followerPhotos = []

    #photos uploaded by the followers
    @usersF.each do |u|
      u.photos.each do |p|
        @followerPhotos.append(p.clone)
        break 
      end
    end
    @followerPhotos = @followerPhotos.sort_by{|e| e[:created_at]}.reverse
    
    #photos of the current user
    @user.photos.each do |p|
      @followerPhotos.unshift(p.clone)
      break
    end

    @tag = Tag.new

  end

  def all 
    @users = User.all
    @user = User.find(params[:id])
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :avatar)
  end


end
