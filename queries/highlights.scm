(comment) @comment

(identifier) @variable

(string_literal) @string
(sortby_expression) @string
(integer_literal) @number
[
    "["
    "]"
] @punctuation.bracket

[
  "PALETTE"
  "BITMAP"
  "TILESET"
  "TILEMAP"
  "MAP"
  "OBJECTS"
  "IMAGE"
  "SPRITE"
  "XGM"
  "XGM2"
  "WAV"
  "BIN"
  "ALIGN"
  "UNGROUP"
  "NEAR"
] @function.builtin
[
  (keyword_compression)
  (keyword_optimization)
  (keyword_ordering)
  (keyword_export)
  (keyword_collision)
  (keyword_sprite_optimization_type)
  (keyword_sprite_optimization_level)
  (keyword_sprite_optimization_duplicate)
  (keyword_xgm_timing)
  (keyword_wav_driver)
  (keyword_wav_far)
] @constant.builtin

(source_file) @none
