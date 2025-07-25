package tree_sitter_rescomp_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_rescomp "github.com/tree-sitter/tree-sitter-rescomp/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_rescomp.Language())
	if language == nil {
		t.Errorf("Error loading Rescomp grammar")
	}
}
