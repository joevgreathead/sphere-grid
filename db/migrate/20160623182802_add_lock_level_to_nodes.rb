class AddLockLevelToNodes < ActiveRecord::Migration[7.0]
  def change
    add_column :nodes, :lock_level, :integer
  end
end
