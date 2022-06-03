class CreateNodeActivations < ActiveRecord::Migration[7.0]
  def change
    create_join_table :characters, :nodes
  end
end
