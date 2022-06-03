# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2016_06_27_182049) do
  create_table "abilities", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "ability_type"
    t.integer "number"
  end

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.string "color"
    t.string "base_attributes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "characters_nodes", id: false, force: :cascade do |t|
    t.integer "character_id", null: false
    t.integer "node_id", null: false
  end

  create_table "nodes", force: :cascade do |t|
    t.integer "x"
    t.integer "y"
    t.string "connections"
    t.string "attribute_name"
    t.integer "value"
    t.integer "ability_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lock_level"
  end

end
