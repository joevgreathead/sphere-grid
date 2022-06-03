class AddTypeAndNumberToAbilities < ActiveRecord::Migration[7.0]
  def change
    add_column :abilities, :type, :string
    add_column :abilities, :number, :integer
  end
end
