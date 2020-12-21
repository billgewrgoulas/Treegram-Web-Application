class AllController < ApplicationController
  def show

    @users = User.all
    @user = User.find(params[:id])
    
  end
end



