(comment) @comment

(identifier) @variable

(string_literal) @string
(sortby_expression) @string
[
  (integer_literal)
  (sprite_size_literal)
] @number
[
    "["
    "]"
] @punctuation.bracket

[
  (keyword_palette)
  (keyword_bitmap)
  (keyword_tileset)
  (keyword_tilemap)
  (keyword_map)
  (keyword_objects)
  (keyword_image)
  (keyword_sprite)
  (keyword_xgm)
  (keyword_xgm2)
  (keyword_wav)
  (keyword_bin)
  (keyword_align)
  (keyword_ungroup)
  (keyword_near)
] @function.builtin
[
  (keyword_compression)
  (keyword_optimization)
  (keyword_ordering)
  (keyword_export)
  (keyword_collision)
  (keyword_far)
  (keyword_sprite_optimization_type)
  (keyword_sprite_optimization_level)
  (keyword_sprite_optimization_duplicate)
  (keyword_xgm_timing)
  (keyword_wav_driver)
] @constant.builtin

(source_file) @none
