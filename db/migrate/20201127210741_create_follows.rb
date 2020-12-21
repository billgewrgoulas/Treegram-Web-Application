class CreateFollows < ActiveRecord::Migration
  def change
    create_table :follows do |t|
      t.integer :follower
      t.integer :followed

      t.timestamps null: false
    end
  end
end
