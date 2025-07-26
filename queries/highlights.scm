(comment) @comment

(identifier) @variable

(string_literal) @string
(integer_literal) @number

[
  "PALETTE"
  "BITMAP"
  "TILESET"
  "TILEMAP"
  "MAP"
  "OBJECT"
] @function.builtin
(keyword_compression) @constant.builtin
(keyword_optimization) @constant.builtin
(keyword_ordering) @constant.builtin
(keyword_export) @constant.builtin

(_statement) @statement
(source_file) @none
