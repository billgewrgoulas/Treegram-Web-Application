Rails.application.routes.draw do
  get '/' => 'home#index'
  resources :users do
    resources :photos
    resources :users
    resources :comments
  end

  resources :photos do
    resources :comments
  end

  resources :tags, only: [:create, :destroy]
  resources :follows , only: [:create, :destroy]  

  get '/log-in' => "sessions#new"
  post '/log-in' => "sessions#create"
  get '/log-out' => "sessions#destroy", as: :log_out
end
