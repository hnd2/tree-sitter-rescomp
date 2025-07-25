/**
 * @file Rescomp grammar for tree-sitter
 * @author hnd
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "rescomp",

  rules: {
    source_file: ($) => repeat($._statement),
    _statement: ($) => choice($.bitmap_expression),
    identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    string_literal: (_) => seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),

    bitmap_compression: ($) =>
      token(
        choice(
          "-1",
          "0",
          "1",
          "2",
          "AUTO",
          "BEST",
          "NONE",
          "APLIB",
          "FAST",
          "LZ4W",
        ),
      ),

    bitmap_expression: ($) =>
      seq(
        "BITMAP",
        $.identifier,
        $.string_literal,
        optional($.bitmap_compression),
      ),
  },
});
