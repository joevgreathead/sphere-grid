class ChangeAttributeToAttributeNameInNodes < ActiveRecord::Migration[7.0]
  def change
    rename_column :nodes, :attribute, :attribute_name
  end
end
