class CommentsController < ApplicationController
    def index
        @comment = Comment.all
    end

    def new
        user = session[:user_id]
        @comment = Comment.new(id: params[:id])
        @photo = Photo.find(params[:photo_id])
    end

    def create
        @comment = Comment.create(text: params[:text] , user_id: params[:user_id] , photo_id: params[:photo_id] )
	user = User.find(params[:user_id])
        render json: {text: params[:text] , email: user.email , avatar:  user.avatar.url(:thumb) }
        return
    end 

    def show
        @photo = Photo.find(params[:id])
        @commentsDto = [ ]
        comments = @photo.comments

        comments.each do |c|
          u = User.find(c.user_id)
          # Json comment model with necessery information to display the comments list
          @commentsDto.unshift( { "avatarUrl" => u.avatar.url(:thumb)  , "text" => c.text , "email" => u.email} )
        end

        @user = User.find(params[:user_id])
    end

    private
        def commentParams
        params.require(:comment).permit(:comment)
        end
end