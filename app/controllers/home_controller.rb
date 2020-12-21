class HomeController < ApplicationController
  def index
     redirect_to log_in_path
  end
end
