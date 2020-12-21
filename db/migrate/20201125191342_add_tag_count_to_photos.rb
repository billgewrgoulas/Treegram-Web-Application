class AddTagCountToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :tagcount, :integer
  end
end
