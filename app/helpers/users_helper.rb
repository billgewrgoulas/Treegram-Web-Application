module UsersHelper
  def is_following(user)
    follow = Follow.exists?(follower: session[:user_id], followed: user.id)
    if follow
      render_haml <<-HAML
        %i#uidI.fas.fa-check{:style => "color:green;"}
      HAML
    else
      render_haml <<-HAML
        %i#uidI.fas.fa-times
      HAML
    end
  end
  def render_haml(haml, locals = {})
    Haml::Engine.new(haml.strip_heredoc, format: :html5).render(self, locals)
  end
end