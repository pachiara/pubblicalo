class CreateMovements < ActiveRecord::Migration
  def change
    create_table :movements do |t|
      t.integer :anno
      t.integer :mese
      t.string :tipo_conto
      t.integer :livello
      t.string :conto
      t.text :voce
      t.decimal :importo

      t.timestamps null: false
    end
  end
end
