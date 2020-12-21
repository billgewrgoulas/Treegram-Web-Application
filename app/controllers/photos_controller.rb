class PhotosController < ApplicationController
  protect_from_forgery unless: -> { request.format.json? }
  def create
    @user = User.find(params[:user_id])
    if params[:photo] == nil

      flash[:alert] = "Please upload a photo"
      redirect_to :back
    else
      @photo = Photo.create(photo_params)
      @photo.user_id = @user.id
      @photo.title = params[:title]
      @photo.tagcount = 0
      @photo.save
      flash[:notice] = "New Photo Was Uploaded"
      redirect_to user_path(@user)
    end
  end

  def new
    @user = User.find(params[:user_id])
    @photo = Photo.create()
  end

  def show
    
    ajaxParams = params[:id].split("&")

    photosDto = []
    
    photos = Photo.where(user_id: ajaxParams[1]).sort_by{|e| e[:created_at]}.reverse
    
    i = 2*(ajaxParams[0].to_i)
    
    upper = i + 10

    while i < upper && i<photos.length  do
      puts i
      photosDto.append({p_id: photos[i]['id'] , url: photos[i].image.url, title: photos[i]['title']})
      i +=1
    end

    render json: photosDto

  end

  def destroy

    @photo = Photo.find_by(id: params[:id] , user_id: session[:user_id])

    if @photo == nil
      #belongs to some1 the user follows
      p = Photo.find(params[:id])
      user = User.find_by(id: p.user_id)
      render json: { failed: true , email: user.email }
      return
    end

    @photo.destroy
    
    render json: { failed: false }
    return

  end    

  private
  def photo_params
    params.require(:photo).permit(:image)
  end

end
