class ChangeTypeToAbilityTypeInAbilities < ActiveRecord::Migration[7.0]
  def change
    rename_column :abilities, :type, :ability_type
  end
end
