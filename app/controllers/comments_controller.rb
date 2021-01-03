class CommentsController < ApplicationController
    protect_from_forgery unless: -> { request.format.json? }
    skip_before_action :verify_authenticity_token
    

    def new
        user = session[:user_id]
        @comment = Comment.new(id: params[:id])
        @photo = Photo.find(params[:photo_id])
    end

    def create
        data = JSON.parse(params["jsondata"])
        @comment = Comment.create(text: data['text'] , user_id: data['uid'] , photo_id: data['pid'] )
	user = User.find(data['uid'])
        render json: {text: data['text'] , email: user.email , url: user.avatar.url(:thumb) }
        return
    end 

    def index

        photo = Photo.find(params[:photo_id])
        commentsDto = [ ]
       
        comments = photo.comments

        comments.each do |c|
          u = User.find(c.user_id)
          commentsDto.append({ url: u.avatar.url(:thumb)  , email: u.email , text: c.text })
        end
        
	render json: commentsDto
        return
    end

    private
        def commentParams
        params.require(:comment).permit(:comment)
        end
end